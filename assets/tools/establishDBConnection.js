const mysql = require("mysql2/promise")
module.exports = {
    //Query
    query: async function(mysqlQuery, data) {

        try {

            const [rows, fields] = await dbConnection.query(mysqlQuery, data);
            return [rows, fields]

        } catch (e) {
            //Overwrite old connection with new one
            dbConnection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                enableKeepAlive: true
            })

            //Exec the mysql query and return data
            const [rows, fields] = await dbConnection.query(mysqlQuery, data);
            return [rows, fields]
        }
    },

    //Execute
    execute: async function(mysqlQuery, data) {
        try {
            const [rows, fields] = await dbConnection.execute(mysqlQuery, data);
            return [rows, fields]
        } catch (e) {
            //Overwrite old connection with new one
            dbConnection = await mysql.createConnection({
                host: "remotemysql.com",
                user: "Ek22wktlmS",
                password: "LIioBtABEy",
                database: "Ek22wktlmS",
            })

            //Exec the mysql query and return data
            const [rows, fields] = await dbConnection.execute(mysqlQuery, data);
            return [rows, fields]
        }
    }
}