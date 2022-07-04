const mongoose = require("mongoose");
const conn = mongoose.createConnection("mongodb://localhost:27017/test");

conn.on("connected", function () {
    console.log(`Mongodb::: connected successfully:::${this.name}`);
});

conn.on("disconnected", function () {
    console.log(`Mongodb::: disconnected successfully:::${this.name}`);
});

conn.on("error", function (err) {
    console.log(`Mongodb::: error: ${JSON.stringify(err)}`);
});

process.on("SIGINT", async function () {
    await conn.close();
    process.exit(0);
});

module.exports = conn;
