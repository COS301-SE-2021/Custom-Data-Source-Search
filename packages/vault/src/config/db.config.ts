const { Pool } = require('pg');
 const pool = new Pool({
    host: '/cloudsql/' + process.env.VDBSTR,
    user: process.env.VDB_user,
    password: process.env.VDB_pass,
    database: process.env.VDB_db,
     port: 5432,
     max: 8,
});

pool.on('connect', () => {
    console.log('Successfully Connected to Database');
});

module.exports = {
    connect: () => {
        return pool.connect()
    }
}