const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require('./connection_redis')

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secrect = process.env.ACCESS_TOKEN_SECRECT;
        const options = {
            expiresIn: "1m", //10m 10s
        };
        JWT.sign(payload, secrect, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};

const verifyToken = (req, res, next) => {
    let headers = req.headers;
    if (!headers["authorization"]) return next(createError.Unauthorized());
    let accessToken = headers["authorization"];
    accessToken = accessToken.split(" ");
    JWT.verify(
        accessToken[1],
        process.env.ACCESS_TOKEN_SECRECT,
        (err, token) => {
            if (err) return next(createError.Unauthorized(err.name));
            req.payload = token;
            next();
        }
    );
};

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secrect = process.env.REFRESH_TOKEN_SECRECT;
        const options = {
            expiresIn: "1y", //10m 10s
        };
        JWT.sign(payload, secrect, options, (err, token) => {
            if (err) reject(err);
            client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if(err) {
                    return reject(createError.InternalServerError(err))
                }
                resolve(token);
            })
        });
    });
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRECT, (err, payload) => {
            if(err) reject(err);
            client.get(payload.userId, (err, reply) => {
                if(err) return reject(createError.InternalServerError(err)) 

                if(reply === refreshToken) return resolve(payload);
                
                return reject(createError.Unauthorized())
            })
        })
    })
}

module.exports = {
    signAccessToken,
    verifyToken,
    signRefreshToken,
    verifyRefreshToken
};
