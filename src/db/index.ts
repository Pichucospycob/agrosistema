import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';
import * as schema from './schema';
import fs from 'fs';

// En Electron main process, usamos path absoluto si es posible o relativo al running directory
// Para dev 'local.db' esta en raiz.
const DB_PATH = 'local.db';

export type AppDatabase = ReturnType<typeof drizzle>;

let dbInstance: AppDatabase | null = null;
let sqlDbInstance: any = null; // To call export()

export async function initDb(): Promise<{ db: AppDatabase, save: () => void }> {
    if (dbInstance && sqlDbInstance) return { db: dbInstance, save: saveDb };

    const SQL = await initSqlJs();
    let buffer: Buffer | null = null;

    if (fs.existsSync(DB_PATH)) {
        buffer = fs.readFileSync(DB_PATH);
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
    fs.writeFileSync(DB_PATH, buffer);
}

export function runMigrations() {
    if (!sqlDbInstance) return;
    try {
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
        if (!checkColumn('orders', 'pressure_unit')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN pressure_unit text");
        if (!checkColumn('orders', 'remito_number')) sqlDbInstance.run("ALTER TABLE orders ADD COLUMN remito_number integer");

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
