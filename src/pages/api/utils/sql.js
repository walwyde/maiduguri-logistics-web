import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const connectionUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: connectionUrl.hostname,
  port: connectionUrl.port || 3306,
  user: connectionUrl.username,
  password: connectionUrl.password,
  database: connectionUrl.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function sql(strings, ...values) {
  const parts = [];
  const params = [];

  for (let i = 0; i < strings.length; i++) {
    parts.push(strings[i]);
    if (i < values.length) {
      const value = values[i];
      if (value && value.isSqlFragment) {
        parts.push(value.sql);
        params.push(...value.params);
      } else {
        parts.push("?");
        params.push(value);
      }
    }
  }

  const finalSql = parts.join("").trim();
  const exec = async () => {
    const [rows] = await pool.query(finalSql, params);
    return rows;
  };

  exec.isSqlFragment = true;
  exec.sql = finalSql;
  exec.params = params;
  return exec;
}

sql.join = (fragments, separator = ", ") => {
  if (fragments.length === 0) return sql.raw("");
  return fragments.reduce((prev, curr) => 
    prev ? sql`${prev}${sql.raw(separator)}${curr}` : curr
  );
};

sql.raw = (str) => ({
  isSqlFragment: true,
  sql: str,
  params: [],
});

sql.query = async (strings, ...values) => {
  const fragment = sql(strings, ...values);
  return await fragment();
};

// Proper exports
export default sql;
export const join = sql.join;
export const raw = sql.raw;
export const query = sql.query;