// test-db.js
require('dotenv').config({ path: '.env.local' }); // Load passwords
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('1. Reading .env.local...');
  console.log('   Host:', process.env.MYSQL_HOST);
  console.log('   User:', process.env.MYSQL_USER);
  console.log('   Port:', process.env.MYSQL_PORT);

  if (!process.env.MYSQL_HOST) {
    console.error('❌ ERROR: Could not read .env.local file. Passwords are missing.');
    return;
  }

  try {
    console.log('2. Connecting to Aiven Database...');
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ SUCCESS! Database Connected!');
    console.log('3. Closing connection...');
    await connection.end();
  } catch (error) {
    console.error('❌ CONNECTION FAILED:', error.message);
  }
}

testConnection();