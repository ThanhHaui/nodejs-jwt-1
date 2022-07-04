const mongoose = require("mongoose");
require("dotenv").config();

function newConnection(uri) {
    const conn = mongoose.createConnection(uri);
    
    conn.on("connected", function () {
        console.log(`Mongodb::: connected successfully:::${this.name}`);
    });

    conn.on("disconnected", function () {
        console.log('uri', uri)
        console.log(`Mongodb::: disconnected successfully:::${this.name}`);
    });

    conn.on("error", function (err) {
        console.log(`Mongodb::: error: ${JSON.stringify(err)}`);
    });

    return conn;
}

let testConnection = newConnection(process.env.MONGODB_TEST_URI);
let flightConnection = newConnection(process.env.MONGODB_FLIGHT_URI);

module.exports = {
    testConnection,
    flightConnection,
};
