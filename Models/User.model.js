const mongoose = require('mongoose')
const Schema = mongoose.Schema
let { testConnection } = require("../helpers/connections_multiple_mongodb")
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(this.password, salt)
        this.password = hashPass
        next()
    } catch (err) {
        next(err);
    }
})

UserSchema.methods.isCheckUser = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (err) {
        
    }
}

module.exports = testConnection.model('users', UserSchema)