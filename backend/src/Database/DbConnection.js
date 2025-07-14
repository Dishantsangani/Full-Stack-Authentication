import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DATABASE_USER || "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
});
pool
  .connect()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database Not Connected", err));

export default pool;
