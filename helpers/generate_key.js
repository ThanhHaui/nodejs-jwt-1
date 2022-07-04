const crypto = require('crypto')

const accessSecrectKey = crypto.randomBytes(32).toString('hex')
const refreshSecrectKey = crypto.randomBytes(32).toString('hex')

console.table({
    accessSecrectKey,
    refreshSecrectKey
});