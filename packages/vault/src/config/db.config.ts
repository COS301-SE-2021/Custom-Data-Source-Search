//import * as dotenv from "dotenv";
//const { Pool} = require('pg');


//dotenv.config({path:  __dirname + `/../../../../.env`});

//const pool = new Pool({
//    connectionString: process.env.VAULT_DB_URL
//});
const { Pool } = require('pg');
 const pool = new Pool({
    host: '/cloudsql/' + process.env.VDBSTR,
    user: process.env.VDB_user,
    password: process.env.VDB_pass,
    database: process.env.VDB_db,
     port: 5432,
     max: 8,
});
//client.connect();

pool.on('connect', () => {
    console.log('Successfully Connected to Database');
});

module.exports = {
    connect: () => {
        return pool.connect()
    }
}