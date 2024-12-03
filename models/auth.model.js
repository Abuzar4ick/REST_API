const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'seller'],
    default: 'customer'
  }
}, {
    timestamps: true
})

// parolni heshlash
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// token
userSchema.methods.getJWT = function() {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
  })
}

// compare the password
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)