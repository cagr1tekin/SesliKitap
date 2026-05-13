import sql from 'mssql/msnodesqlv8.js'

const connectionString =
  `Driver={ODBC Driver 17 for SQL Server};` +
  `Server=${process.env.DB_SERVER ?? 'DESKTOP-3OP34F8'};` +
  `Database=${process.env.DB_NAME ?? 'SesliKitapDB'};` +
  `Trusted_Connection=yes;`

const config: sql.config = {
  connectionString,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

export { sql }
