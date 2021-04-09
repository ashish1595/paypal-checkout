import { Pool } from 'pg';

const pool = new Pool ({
    max: +process.env.PG_MAX_POOL,
    connectionString: process.env.PG_STRING,
    idleTimeoutMillis: +process.env.PG_TIMEOUT
});

export default pool;