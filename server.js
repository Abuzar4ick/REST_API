const express = require('express')
const app = express()
const connectMongo = require('./config/db')
const errorHandle = require('./middlewares/error')
const sessionMiddleware = require('./middlewares/session.middleware')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// connect to MongoDB
connectMongo()

app.use(sessionMiddleware)

// image upload
app.use('/upload', express.static(path.join(__dirname, 'public/uploads')))
// routers
app.use('/auth', require('./routers/auth.router'))
app.use('/products', require('./routers/product.router'))
app.use('/carts', require('./routers/cart.router'))

// error
app.use(errorHandle)

// listen the server
const PORT = process.env.PORT || 7001
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Server listening error: ${err}`)
    }
    console.log(`Server listening on port: ${PORT}`)
})