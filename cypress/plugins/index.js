/// <reference types="cypress" />
const mysql = require('mysql')

function queryTestDb(query, config) {
    // creates a new mysql connection using credentials from cypress.json env's
    const connection = mysql.createConnection(config.env.db)
    // start connection to db
    connection.connect()
    // exec query + disconnect to db as a Promise
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) reject(error)
            else {
                connection.end()
                return resolve(results)
            }
        })
    })
}
module.exports = (on, config) => {
    on('task', { queryDb: (query) => { return queryTestDb(query, config) }, })
}
