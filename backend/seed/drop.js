require('dotenv').config();
const mysql = require('mysql2/promise');

async function dropTables() {
    console.log('🗑️  Dropping all tables...');

    // Parse DATABASE_URL manually or constructing from env vars
    // .env has DB_HOST etc.
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: true // TiDB requires SSL usually
        }
    });

    try {
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const [rows] = await connection.query('SHOW TABLES');
        if (rows.length === 0) {
            console.log('No tables found.');
        } else {
            for (const row of rows) {
                const tableName = Object.values(row)[0];
                console.log(`Dropping table: ${tableName}`);
                await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ All tables dropped successfully.');
    } catch (err) {
        console.error('❌ Error dropping tables:', err);
    } finally {
        await connection.end();
    }
}

dropTables();
