import initSqlJs from 'sql.js';
import fs from 'fs';

async function findProblems() {
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync('local.db');
    const db = new SQL.Database(buffer);

    function query(sql) {
        const res = db.exec(sql);
        if (res.length === 0) return [];
        const cols = res[0].columns;
        return res[0].values.map(row => {
            const obj = {};
            cols.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
    }

    console.log("--- Problematic Products (Negative Stock) ---");
    const negStock = query("SELECT * FROM products WHERE current_stock < 0");
    console.log(JSON.stringify(negStock, null, 2));

    console.log("\n--- Orders without items ---");
    const emptyOrders = query("SELECT * FROM orders WHERE id NOT IN (SELECT order_id FROM order_items)");
    console.log(JSON.stringify(emptyOrders, null, 2));

    console.log("\n--- Remitos without orders ---");
    const emptyRemitos = query("SELECT * FROM remitos WHERE id NOT IN (SELECT remito_id FROM orders WHERE remito_id IS NOT NULL)");
    console.log(JSON.stringify(emptyRemitos, null, 2));

    console.log("\n--- Duplicate Order Numbers ---");
    const dupOrders = query("SELECT order_number, COUNT(*) as count FROM orders GROUP BY order_number HAVING count > 1");
    console.log(JSON.stringify(dupOrders, null, 2));

    console.log("\n--- Duplicate Remito Numbers ---");
    const dupRemitos = query("SELECT remito_number, COUNT(*) as count FROM remitos GROUP BY remito_number HAVING count > 1");
    console.log(JSON.stringify(dupRemitos, null, 2));

    console.log("\n--- Order Items with 0 dose but expected quantity ---");
    const weirdItems = query("SELECT * FROM order_items WHERE dose = 0 AND quantity_theoretical > 0");
    console.log(JSON.stringify(weirdItems, null, 2));

    console.log("\n--- Summary of Remitos and Statuses ---");
    const remitoStatusCount = query("SELECT status, COUNT(*) as count FROM remitos GROUP BY status");
    console.log(JSON.stringify(remitoStatusCount, null, 2));

    console.log("\n--- All Remitos ---");
    const allRemitos = query("SELECT * FROM remitos");
    console.log(JSON.stringify(allRemitos, null, 2));

    console.log("\n--- Summary of Orders and Statuses ---");
    const statusCount = query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
    console.log(JSON.stringify(statusCount, null, 2));

    for (const p of negStock) {
        console.log(`\n--- History for ${p.name} (ID: ${p.id}) ---`);
        const history = query(`SELECT * FROM stock_movements WHERE product_id = ${p.id} ORDER BY date`);
        console.log(JSON.stringify(history, null, 2));
    }

    console.log("\n--- Orders for Remito #2 ---");
    const remito2Orders = query("SELECT * FROM orders WHERE remito_id = 2");
    console.log(JSON.stringify(remito2Orders, null, 2));

    console.log("\n--- Items for Remito #2 ---");
    const remito2Items = query("SELECT oi.*, p.name as productName FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.remito_id = 2");
    console.log(JSON.stringify(remito2Items, null, 2));
}

findProblems().catch(console.error);
