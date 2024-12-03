const { Router } = require('express')
const router = Router()
const {
    addNewProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller')
const upload = require('../utils/file.upload');
const { protected, sellerAccess } = require('../middlewares/auth')

router.post('/add', protected, sellerAccess, upload.single('images'), addNewProduct);
router.put('/update/:id', protected, sellerAccess, updateProduct)
router.delete('/:id', protected, sellerAccess, deleteProduct)

module.exports = router