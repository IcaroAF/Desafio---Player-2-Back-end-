const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'brazil_companies',
    password: 'mysql',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
};