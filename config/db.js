const mongoose = require('mongoose')
require('dotenv').config()

const connectMongo = async () => {
    try {
        mongoose.set('strictQuery', true)
        const connecting = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connecting to MongoDB successfuly: ${connecting.connection.host}`)
    } catch (err) {
        console.log(`Error: ${err}`)
        process.exit(1)
    }
}

module.exports = connectMongo