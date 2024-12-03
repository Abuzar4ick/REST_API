const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const User = require('../models/auth.model')

// Himoyani dodasi :)
exports.protected = asyncHandle(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ErrorResponse('Not token', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
    res.user = await User.findById(decoded.id)
    next()
})

exports.sellerAccess = asyncHandle(async (req, res, next) => {
    if (req.user.role !== 'seller') {
        return next(new ErrorResponse('Siz sotuvchi emassiz', 401))
    }
    next()
})