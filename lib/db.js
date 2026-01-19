import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT, // <--- This was missing!
  ssl: {
    rejectUnauthorized: false // <--- This allows secure connection to Aiven
  }
});