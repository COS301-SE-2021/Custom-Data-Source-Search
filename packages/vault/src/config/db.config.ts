
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.VAULT_DB_URL
});

pool.on('connect', () => {
    console.log('Successfully COnnected to DatabAse');
});

module.exports = {
    query: (text: any, params: any) => pool.query(text, params),
}