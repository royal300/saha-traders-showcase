import mysql from "mysql2/promise";

const host = "93.127.206.52";
const user = "root";
const password = "mypass";
const database = "saha_marble_tiles";

// Initialize high-performance persistent connection pool
const pool = mysql.createPool({
  // Use local interface on production VPS for optimal performance and safety
  host: typeof window === "undefined" && process.env.NODE_ENV === "production" ? "127.0.0.1" : host,
  user,
  password,
  database,
  port: 3306,
  connectionLimit: 15,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export default pool;
