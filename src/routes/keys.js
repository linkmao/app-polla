const { Router } = require('express')
const router = Router()
const controller = require('../controllers/keys.js')
const validar = require('../midleware/validaciones')

// VERSION API CON AUTENTICACION DESDE POSTMAN  
// router.get('/', validar.verifyToken, validar.isAdminToken, controller.getKey)
// router.get('/:id', validar.verifyToken, validar.isAdminToken, controller.getKeyById)
// router.post('/', validar.verifyToken, validar.isAdminToken, controller.addKey)
// router.put('/:id', validar.verifyToken, validar.isAdminToken, controller.updateKey)
// router.delete('/:id', validar.verifyToken, validar.isAdminToken, controller.deleteKey)
// router.delete('/', validar.verifyToken, validar.isAdminToken, controller.deleteAllKey)

// VERSION API CON AUTENTICACION DESDE LA WEB
router.get('/', validar.isAuth, validar.isAdmin, controller.getKey)
router.get('/:id', validar.isAuth, validar.isAdmin, controller.getKeyById)
router.post('/', validar.isAuth, validar.isAdmin, controller.addKey)
router.put('/:id', validar.isAuth, validar.isAdmin, controller.updateKey)
router.delete('/:id', validar.isAuth, validar.isAdmin, controller.deleteKey)
router.delete('/', validar.isAuth, validar.isAdmin, controller.deleteAllKey)

// Version api de prueba sin necesidad d autentcacón USANDO POSTMAN
router.get('/dev/postman', controller.getKey)
router.get('/dev/postman/:id', controller.getKeyById)
router.post('/dev/postman', controller.addKey)
router.put('/dev/postman/:id', controller.updateKey)
router.delete('/dev/postman/:id', controller.deleteKey)
router.delete('/dev/postman', controller.deleteAllKey)

module.exports = router