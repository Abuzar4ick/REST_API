const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const Product = require('../models/product.model')
const User = require('../models/auth.model')
const Order = require('../models/order.model')
const { default: mongoose } = require('mongoose')

exports.allProducts = asyncHandle(async (req, res, next) => {
    const getAllProducts = await Product.find()
    if (!getAllProducts) {
        return next(new ErrorResponse("Bu yerda hozircha product lar yo'q", 404))
    }
    res.status(200).json({
        success: true,
        data: getAllProducts
    })
})

exports.getProductById = asyncHandle(async (req, res, next) => {
    const isLogined = req.session.isLogined
    const { id } = req.params
    if (!isLogined) {
        return next(new ErrorResponse("Oldin ro'yxatdan o'ting"))
    }
    const cart = await Product.findById({_id: id})
    if (!cart) {
        return next(new ErrorResponse("Bunday id li product topilmadi", 404))
    }
    res.status(200).json({
        success: true,
        data: cart
    })
})

exports.addOrder = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const isLogined = req.session.isLogined
    if (!isLogined) {
        return next(new ErrorResponse("Oldin ro'yxatdan o'ting"))
    }
    const findProduct = await Product.findById(id)
    if (!findProduct) {
        return next(new ErrorResponse("Bunday id li product topilmadi", 404))
    }
    const savedOrder = await Order.create({
        userId: req.session.user._id,
        products: [
            {
                productId: findProduct._id,
                quantity: 1
            }
        ],
        totalPrice: findProduct.price,
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        message: 'Buyurtma yaratildi',
        order: savedOrder
    });
})

exports.deleteOrder = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const findOrder = await Order.findById(id)
    if (!findOrder) {
        return next(new ErrorResponse("Bunday id li order yo'q"))
    }
    if (findOrder.status === 'completed') {
        return next(new ErrorResponse("Bu buyurtma allaqachon amalga oshirilib bo'lgan"))
    }
    const userId = req.session.user._id
    if (userId !== findOrder.userId.toString()) {
        return next(new ErrorResponse("Bu sizni orderingiz emas", 400))
    }
    const deletedOrder = await Order.findByIdAndDelete(id)
    res.status(201).json({
        success: true,
        data: deletedOrder
    })
})

exports.completeOrder = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const findOrder = await Order.findById(id)
    if (!findOrder) {
        return next(new ErrorResponse("Bunday id li order yo'q"))
    }
    if (findOrder.status === 'completed') {
        return next(new ErrorResponse("Bu buyurtma allaqachon amalga oshirilib bo'lgan"))
    }
    const userId = req.session.user._id
    if (userId !== findOrder.userId.toString()) {
        return next(new ErrorResponse("Bu sizni orderingiz emas", 400))
    }
    const completeOrder = await Order.findByIdAndUpdate(
        id,
        { status: 'completed' },
        { new: true }
    )

    res.status(200).json({
        success: true,
        message: 'Buyurtma amalga oshirildi',
        data: completeOrder
    })
})