import initSqlJs from 'sql.js';
import fs from 'fs';

async function dump() {
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync('local.db');
    const db = new SQL.Database(buffer);

    console.log("--- Tables ---");
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(JSON.stringify(tables[0].values.flat(), null, 2));

    const tableList = tables[0].values.flat().filter(t => !t.startsWith('sqlite_'));

    for (const table of tableList) {
        console.log(`\n--- ${table} ---`);
        try {
            const result = db.exec(`SELECT * FROM ${table} LIMIT 20`);
            if (result.length > 0) {
                const cols = result[0].columns;
                const rows = result[0].values;
                const data = rows.map(row => {
                    const obj = {};
                    cols.forEach((col, i) => obj[col] = row[i]);
                    return obj;
                });
                console.log(JSON.stringify(data, null, 2));
            } else {
                console.log("[]");
            }
        } catch (e) {
            console.error(`Error reading ${table}:`, e.message);
        }
    }
}

dump().catch(console.error);
