const errorHandle = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message
    if (!error.statusCode) {
        error.statusCode = 500
    }
    res.status(error.statusCode).json({
        success: false,
        error: error.message || 'Server error'
    })
}

module.exports = errorHandle