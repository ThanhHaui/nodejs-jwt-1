const express = require('express')
const route = express.Router()
const { verifyToken } = require('../helpers/jwt_service')
const UserController = require('../Controllers/User.controller')

route.post('/register', UserController.register)

route.post('/refresh-token', UserController.refreshToken)

route.post('/login', UserController.login)

route.delete('/logout', UserController.logout)

route.get('/list', verifyToken, UserController.userList)

module.exports = route