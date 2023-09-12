const mysql = require('serverless-mysql');

module.exports = async () => {
    return mysql().config(process.env.MYSQL_DSN)
}