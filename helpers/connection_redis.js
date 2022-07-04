const redis = require('redis');
const client = redis.createClient({
    port:6379,
    host: '127.0.0.1'
})

client.ping((err, pong) => {
    console.log(pong);
});

client.on("error", (err) => console.error(err));

client.on("connect", function (err) {
    console.log("Connected to Redis");
});

client.on("ready", function (err) {
    console.log("Ready to connect");
});

module.exports = client;
