const { Router } = require('express')
const router = Router()
const { body, validationResult } = require('express-validator')
const {
    addNewUser,
    login,
    logout,
    profile
} = require('../controllers/auth.controller')

router.post('/signup', [
    body('name').notEmpty().withMessage('Ismni kiriting'),
    body('email').isEmail().withMessage('Noto\'g\'ri email formatini kiriting'),
    body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgi bo\'lishi kerak'),
    body('role').notEmpty().withMessage('Rolni tanlang'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        next()
}, addNewUser])

router.post('/login', [
    body('email').isEmail().withMessage('Noto\'g\'ri email formatini kiriting'),
    body('password').notEmpty().withMessage('Parolni kiriting'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        next()
}, login])

router.get('/logout', logout)
router.get('/profile', profile)

module.exports = router