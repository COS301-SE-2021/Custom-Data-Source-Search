import * as dotenv from "dotenv";
const { Pool } = require('pg');


dotenv.config({path:  __dirname + `/../../../../.env`});
console.log("found env: " + process.env.VAULT_DB_URL + "   " + __dirname);

const pool = new Pool({
    connectionString: process.env.VAULT_DB_URL
});

pool.on('connect', () => {
    console.log('Successfully Connected to Database');
});

module.exports = {
    query: (text: any, params: any) => pool.query(text, params),
}