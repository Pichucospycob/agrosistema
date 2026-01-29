import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';
import * as schema from './schema';
import fs from 'fs';

// En Electron main process, usamos path absoluto si es posible o relativo al running directory
// Para dev 'local.db' esta en raiz, pero Electron pasara la ruta correcta.
let currentDbPath = 'local.db';

export type AppDatabase = ReturnType<typeof drizzle>;

let dbInstance: AppDatabase | null = null;
let sqlDbInstance: any = null; // To call export()

export async function initDb(dbPath?: string): Promise<{ db: AppDatabase, save: () => void }> {
    if (dbPath) currentDbPath = dbPath;

    if (dbInstance && sqlDbInstance) return { db: dbInstance, save: saveDb };

    const SQL = await initSqlJs();
    let buffer: Buffer | null = null;

    if (fs.existsSync(currentDbPath)) {
        buffer = fs.readFileSync(currentDbPath);
    }

    // @ts-ignore
    sqlDbInstance = new SQL.Database(buffer);
    dbInstance = drizzle(sqlDbInstance, { schema });

    return { db: dbInstance, save: saveDb };
}

function saveDb() {
    if (!sqlDbInstance) return;
    const data = sqlDbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(currentDbPath, buffer);
}

export function runMigrations() {
    if (!sqlDbInstance) return;
    try {
        // --- Core Schema Initialization ---
        // Ensure all tables exist from the start
        sqlDbInstance.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                active_ingredient TEXT,
                presentation TEXT,
                current_stock REAL DEFAULT 0 NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS lots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                surface REAL NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number INTEGER NOT NULL,
                remito_number INTEGER,
                remito_id INTEGER,
                date TEXT NOT NULL,
                campaign TEXT,
                contractor TEXT,
                field TEXT,
                crop TEXT,
                labor TEXT,
                implanted INTEGER,
                total_surface REAL,
                status TEXT NOT NULL DEFAULT 'BORRADOR',
                nozzle_type TEXT,
                nozzle_description TEXT,
                water_per_ha REAL,
                pressure REAL,
                pressure_unit TEXT,
                wind_speed REAL,
                humidity REAL,
                instructions TEXT,
                observations TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS order_lots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL REFERENCES orders(id),
                lot_id INTEGER NOT NULL REFERENCES lots(id),
                applied_surface REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL REFERENCES orders(id),
                product_id INTEGER NOT NULL REFERENCES products(id),
                dose REAL NOT NULL,
                quantity_theoretical REAL NOT NULL,
                quantity_delivered REAL DEFAULT 0,
                quantity_returned REAL DEFAULT 0,
                quantity_real REAL DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS stock_movements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT DEFAULT CURRENT_TIMESTAMP,
                product_id INTEGER NOT NULL REFERENCES products(id),
                order_id INTEGER REFERENCES orders(id),
                type TEXT NOT NULL,
                quantity REAL NOT NULL,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS empty_containers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL REFERENCES products(id),
                pending_return INTEGER DEFAULT 0 NOT NULL,
                delivered_cat INTEGER DEFAULT 0 NOT NULL
            );
        `);

        // Explicitly check and add columns. sql.js uses .exec() which runs multiple statements if needed, 
        // or .run() for single with params.

        // Helper to check column
        const checkColumn = (table: string, col: string) => {
            const res = sqlDbInstance.exec(`PRAGMA table_info(${table})`);
            if (res.length > 0) {
                const cols = res[0].values.map((v: any[]) => v[1]); // Index 1 is name
                return cols.includes(col);
            }
            return false;
        };

        if (!checkColumn('orders', 'field')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN field text");
        if (!checkColumn('orders', 'implanted')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN implanted integer");
        if (!checkColumn('orders', 'total_surface')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN total_surface real");
        if (!checkColumn('orders', 'nozzle_description')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN nozzle_description text");
        if (!checkColumn('orders', 'instructions')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN instructions text");
        if (!checkColumn('orders', 'pressure_unit')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN pressure_unit text");
        if (!checkColumn('orders', 'remito_number')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN remito_number integer");

        // --- New Remitos Migrations ---
        sqlDbInstance.run(`
            CREATE TABLE IF NOT EXISTS remitos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                remito_number INTEGER NOT NULL,
                date TEXT NOT NULL,
                contractor TEXT,
                observations TEXT,
                status TEXT NOT NULL DEFAULT 'EMITIDO',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        if (!checkColumn('orders', 'remito_id')) {
            sqlDbInstance.run("ALTER TABLE orders ADD COLUMN remito_id INTEGER REFERENCES remitos(id)");
        }

        // --- Supplier Remitos Migrations ---
        sqlDbInstance.run(`
            CREATE TABLE IF NOT EXISTS supplier_remitos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                remito_number TEXT NOT NULL,
                date TEXT NOT NULL,
                supplier TEXT NOT NULL,
                observations TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        sqlDbInstance.run(`
            CREATE TABLE IF NOT EXISTS supplier_remito_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                remito_id INTEGER NOT NULL REFERENCES supplier_remitos(id),
                product_id INTEGER NOT NULL REFERENCES products(id),
                quantity REAL NOT NULL
            )
        `);

        if (!checkColumn('order_items', 'quantity_delivered')) sqlDbInstance.run("ALTER TABLE order_items ADD COLUMN quantity_delivered real DEFAULT 0");
        if (!checkColumn('order_items', 'quantity_returned')) sqlDbInstance.run("ALTER TABLE order_items ADD COLUMN quantity_returned real DEFAULT 0");
        if (!checkColumn('order_items', 'quantity_real')) sqlDbInstance.run("ALTER TABLE order_items ADD COLUMN quantity_real real DEFAULT 0");
        if (!checkColumn('order_items', 'quantity_theoretical')) sqlDbInstance.run("ALTER TABLE order_items ADD COLUMN quantity_theoretical real DEFAULT 0");

        saveDb(); // Save changes immediately
        console.log("Migrations applied successfully.");
    } catch (e) {
        console.error("Migration error:", e);
    }
}
