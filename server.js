const express = require("express");
const app = express();
const createErr = require("http-errors");
const UserRouter = require("./Routes/User.route");
const client = require("./helpers/connection_redis");
require("dotenv").config();

// require('./helpers/connections_mongodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRouter);

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html')
})

app.use((req, res, next) => {
    next(createErr.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message || "Something went wrong",
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
