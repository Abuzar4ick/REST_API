const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const Product = require('../models/product.model')

exports.addNewProduct = asyncHandle(async (req, res, next) => {
    const { name, description, price } = req.body
    const isLogined = req.session.isLogined
    if (!isLogined) {
        return next(new ErrorResponse("Oldin ro'yxatdan o'ting"))
    }
    if (req.session.user.role !== 'seller') {
        return next(new ErrorResponse("Uzur, buni faqat sotuvchi qiladi"))
    }
    if (!req.file) {
        return next(new ErrorResponse("Iltimos, hamma ma'lumotlarni kiriting"))
    }
    const imagePath = `/uploads/${req.file.filename}`
    const product = await Product.create({
        name, 
        description,
        price: Number(price),
        images: imagePath,
        sellerId: req.session.user._id
    })
    res.status(201).json({
        success: true,
        data: product
    })
})

exports.updateProduct = asyncHandle(async (req, res, next) => {
    const { name, description, price } = req.body
    const { id } = req.params
    const isLogined = req.session.isLogined
    if (!isLogined) {
        return next(new ErrorResponse("Oldin ro'yxatdan o'ting", 400));
    }
    if (req.session.user.role !== 'seller') {
        return next(new ErrorResponse("Uzur, buni faqat sotuvchi qiladi", 400));
    }
    const findProduct = await Product.findById(id)
    if (findProduct.sellerId.toString() !== req.session.user._id.toString()) {
        return next(new ErrorResponse("Bu sizni card emas", 400))
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price },
        { new: true }
    )
    res.status(200).json({
        success: true,
        data: updatedProduct
    })
})

exports.deleteProduct = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const isLogined = req.session.isLogined
    if (!isLogined) {
        return next(new ErrorResponse("Oldin ro'yxatdan o'ting", 400));
    }
    if (req.session.user.role !== 'seller') {
        return next(new ErrorResponse("Uzur, buni faqat sotuvchi qiladi", 400));
    }
    const findProduct = await Product.findById(id)
    if (findProduct.sellerId.toString() !== req.session.user._id.toString()) {
        return next(new ErrorResponse("Bu sizni card emas", 400))
    }

    const deletedProduct = await Product.findByIdAndDelete(id)
    res.status(201).json({
        success: true,
        message: "Siz productingizni o'chirdingiz",
        data: deletedProduct
    })
})