const { Router } = require('express')
const router = Router()
const {
    allProducts,
    getProductById,
    addOrder,
    deleteOrder,
    completeOrder
} = require('../controllers/carts.controller')

router.get('/all', allProducts)
router.get('/cart/:id', getProductById)
router.post('/add/:id', addOrder)
router.delete('/delete/:id', deleteOrder)
router.patch('/complete/:id', completeOrder)

module.exports = router