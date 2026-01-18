import Database from 'better-sqlite3';

const db = new Database('local.db');

try {
    const info = db.pragma('table_info(orders)');
    console.log('Columns in orders table:', info.map(c => c.name));

    const hasField = info.some(c => c.name === 'field');
    console.log('Has field column:', hasField);
} catch (error) {
    console.error('Error checking DB:', error);
}
db.close();
