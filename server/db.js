import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'legalbell_db',
  password: 'Sayan@0306',
  port: 5432,
});
