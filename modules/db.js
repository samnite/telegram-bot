const mysql = require("mysql");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const db = {
	mysql_pool: mysql.createPool(`${process.env.CLEARDB_DATABASE_URL}&multipleStatements=true`),
};

module.exports = db;
