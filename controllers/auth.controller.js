const User = require('../models/auth.model')
const Product = require('../models/product.model')
const asyncHandle = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Order = require('../models/order.model')

exports.addNewUser = asyncHandle(async (req, res, next) => {
    const isLogined = req.session.isLogined
    const { name, email, password, role } = req.body
    if (isLogined) {
        return next(new ErrorResponse("Siz allaqachon ro'yxatdan o'tib bo'lgansiz"))
    }
    if (!name || !email || !password || !role) {
        return next(new ErrorResponse("Iltimos, hamma ma'lumotlarni kiriting"))
    }
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    const token = user.getJWT()
    res.status(201).json({
        success: true,
        data: user,
        token
    })
})

exports.login = asyncHandle(async (req, res, next) => {
    const isLogined = req.session.isLogined
    const { email, password } = req.body
    if (isLogined) {
        return next(new ErrorResponse("Siz allaqachon ro'yxatdan o'tib bo'lgansiz", 400))
    }
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorResponse("Bunday user topilmadi", 404))
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse("Siz noto'g'ri parol tergan ko'rinasiz", 401))
    }
    const token = user.getJWT()
    req.session.user = user
    req.session.isLogined = true
    req.session.save((err) => {
        if (err) {
            return next(err)
        }
        return res.status(200).json({
            success: true,
            message: "Tabriklaman, siz ro'yxatdan o'tdingiz",
            data: user,
            token
        })
    })
})

exports.logout = asyncHandle(async (req, res, next) => {
    if (req.session && req.session.isLogined) {
        req.session.destroy((err) => {
            if (err) {
                return next(new ErrorResponse("Error:", 500))
            }
            return res.status(200).json({
                success: true,
                message: "Siz tizimdan chiqdingiz"
            })
        })
    } else {
        return res.status(400).json({
            success: false,
            message: "Siz allaqachon tizimdan chiqib bo'lgansiz"
        })
    }
})

exports.profile = asyncHandle(async (req, res, next) => {
    const isLogined = req.session.isLogined
    const user = req.session.user

    if (!isLogined || !user) {
        return next(new ErrorResponse("Siz hali ro'yxatdan o'tganingiz yo'q"))
    }
    const profile = await User.findById(req.session.user._id)
    const profileProducts = await Product.find({ sellerId: req.session.user._id })
    let yourCarts = []
    if (user.role === "customer") {
        yourCarts = await Order.find({ userId: req.session.user._id })
    }
    return res.status(200).json({
        success: true,
        profile: profile,
        yourProducts: profileProducts,
        yourCarts: yourCarts
    })
})