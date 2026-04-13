const { Router } = require('express')
const router = Router()
const { getUsersCompletionStatus } = require('../controllers/admin-completion')
const validar = require('../midleware/validaciones')

// Solo admin puede acceder
router.get('/completion-status', validar.isAuth, validar.isAdmin, getUsersCompletionStatus)

module.exports = router
