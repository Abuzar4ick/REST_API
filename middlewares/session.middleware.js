// session.middleware.js
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'maxfiy-kalit',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
})

module.exports = sessionMiddleware