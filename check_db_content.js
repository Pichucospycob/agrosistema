import Database from 'better-sqlite3';

const db = new Database('local.db');

console.log("--- Orders ---");
const orders = db.prepare('SELECT * FROM orders').all();
console.table(orders);

console.log("\n--- Order Items ---");
const items = db.prepare('SELECT * FROM order_items').all();
console.table(items);

console.log("\n--- Products ---");
const products = db.prepare('SELECT * FROM products').all();
console.table(products);
