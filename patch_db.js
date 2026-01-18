import Database from 'better-sqlite3';

const db = new Database('local.db');

console.log("Starting DB Patch...");
try {
    // Check if columns exist, if not add them
    const columns = db.pragma('table_info(orders)').map(c => c.name);

    if (!columns.includes('field')) {
        console.log("Adding 'field' column...");
        db.prepare("ALTER TABLE orders ADD COLUMN field text").run();
    }
    if (!columns.includes('implanted')) {
        console.log("Adding 'implanted' column...");
        db.prepare("ALTER TABLE orders ADD COLUMN implanted integer").run();
    }
    if (!columns.includes('total_surface')) {
        console.log("Adding 'total_surface' column...");
        db.prepare("ALTER TABLE orders ADD COLUMN total_surface real").run();
    }
    if (!columns.includes('nozzle_description')) {
        console.log("Adding 'nozzle_description' column...");
        db.prepare("ALTER TABLE orders ADD COLUMN nozzle_description text").run();
    }
    if (!columns.includes('pressure_unit')) {
        console.log("Adding 'pressure_unit' column...");
        db.prepare("ALTER TABLE orders ADD COLUMN pressure_unit text").run();
    }

    // Check order_items for new columns
    const itemColumns = db.pragma('table_info(order_items)').map(c => c.name);
    if (!itemColumns.includes('quantity_delivered')) {
        console.log("Adding 'quantity_delivered' to order_items...");
        db.prepare("ALTER TABLE order_items ADD COLUMN quantity_delivered real DEFAULT 0").run();
    }
    if (!itemColumns.includes('quantity_returned')) {
        console.log("Adding 'quantity_returned' to order_items...");
        db.prepare("ALTER TABLE order_items ADD COLUMN quantity_returned real DEFAULT 0").run();
    }
    if (!itemColumns.includes('quantity_real')) {
        console.log("Adding 'quantity_real' to order_items...");
        db.prepare("ALTER TABLE order_items ADD COLUMN quantity_real real DEFAULT 0").run();
    }
    if (!itemColumns.includes('quantity_theoretical')) {
        // This was in original schema? If not add it.
        // It was added in previous step.
        console.log("Adding 'quantity_theoretical' to order_items...");
        db.prepare("ALTER TABLE order_items ADD COLUMN quantity_theoretical real DEFAULT 0").run();
    }

    console.log("Patch completed successfully!");
} catch (error) {
    console.error("Error patching DB:", error);
}
db.close();
