const { Router } = require('express')
const router = Router()
const controller = require('../controllers/teams.js')
const validar = require('../midleware/validaciones')
const upload = require('../midleware/upload')

// VERSION API CON AUTENTICACION VIA TOKEN
// router.get('/', validar.verifyToken, validar.isAdminToken, controller.getTeam)
// router.get('/:id', validar.verifyToken, validar.isAdminToken, controller.getTeamById)
// router.post('/', validar.verifyToken, validar.isAdminToken, controller.addTeam)
// router.put('/:id', validar.verifyToken, validar.isAdminToken, controller.updateTeam)
// router.delete('/:id', validar.verifyToken, validar.isAdminToken, controller.deleteTeam)
// router.delete('/', validar.verifyToken, validar.isAdminToken, controller.deleteAllTeam)

// VERSION API CON AUTENTICACION
router.get('/', validar.isAuth, controller.getTeam)
router.get('/:id', validar.isAuth, controller.getTeamById)
router.post('/', validar.isAuth, validar.isAdmin, upload.single('flag'), controller.addTeam)
router.put('/:id', validar.isAuth, validar.isAdmin, upload.single('flag'), controller.updateTeam)
router.delete('/:id', validar.isAuth, validar.isAdmin, controller.deleteTeam)
router.delete('/', validar.isAuth, validar.isAdmin, controller.deleteAllTeam)

// Version api de prueba sin necesidad de autentcacón USANDO POSTMAN
router.get('/dev/postman', controller.getTeam)
router.get('/dev/postman/:id', controller.getTeamById)
router.post('/dev/postman', controller.addTeam)
router.put('/dev/postman/:id', controller.updateTeam)
router.delete('/dev/postman/:id', controller.deleteTeam)
router.delete('/dev/postman', controller.deleteAllTeam)

module.exports = router