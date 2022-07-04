const createError = require('http-errors')
const User = require('../Models/User.model')
const { userValidate } = require('../helpers/validation')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service')
const client = require('../helpers/connection_redis')

module.exports = {
    register: async (req, res, next) => {
        try {
            let { email, password } = req.body
            const {error} = userValidate(req.body)
            
            if(error) {
                throw createError(error.details[0].message)
            }
    
            let isExist = await User.findOne({email})
            if(isExist) {
                throw createError.Conflict(`${email} is already registered`)
            }
    
            let user = new User({email, password})
    
            let createUser = await user.save()
    
            return res.json({
                success: true,
                data: createUser
            })
        } catch (err) {
            next(err)
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            let {refreshToken} = req.body
            if(!refreshToken) throw createError.BadRequest('REFRESH_TOKEN_INVALID')
    
            let {userId} = await verifyRefreshToken(refreshToken)
            const accessToken = await signAccessToken(userId)
            refreshToken = await signRefreshToken(userId)
            return res.json({
                success: true,
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    time_expired: Date.now() + (60 * 1000)
                }
            })
        } catch(err) {
            next(err)
        }
    },

    login: async (req, res, next) => {
        try {
            let { email, password } = req.body
            const {error} = userValidate(req.body)
            
            if(error) {
                throw createError(error.details[0].message)
            }
    
            let user = await User.findOne({email})
            if(!user) {
                throw createError.NotFound('User not found')
            }
    
            let isCorrectPassword = await user.isCheckUser(password)  
            if(!isCorrectPassword) {
                throw createError.Unauthorized('Password is incorrect')
            }
    
            const accessToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
    
            return res.json({
                success: true,
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    time_expired: Date.now() + (60 * 1000)
                }
            })
        } catch (err) {
            next(err)
        }
    },

    logout: async (req, res, next) => {
        try {
            let { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest('REFRESH_TOKEN_INVALID')
    
            let {userId} = await verifyRefreshToken(refreshToken)
    
            client.del(userId.toString(), (err, reply) =>{
                if(err) throw createError.InternalServerError()
    
                res.json({
                    message: "Logout!"
                })
            })
        } catch (err) {
            next(err)
        }
    },

    userList: (req, res, next) => {
        let listUser = [
            {
                _id: '1',
                email: 'user1@example.com'
            },
            {
                _id: '2',
                email: 'user2@example.com'
            }
        ]
        res.json({list_user: listUser})
    }
}