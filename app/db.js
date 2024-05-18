import mysql from "mysql2/promise";

// Create a pool of connections
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    await db.getConnection();
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
})();

export default db;
