const {Router} = require('express')
const router= Router()
const controllers = require('../controllers/users')
const validar = require('../midleware/validaciones')

// Version con logueo TOKEN via POSTMAN
router.get('/',validar.verifyToken, validar.isAdminToken,  controllers.getUsers) // obtener todos los usuarios accede cualquiera
router.get('/:id',validar.verifyToken, validar.isAdminToken,  controllers.getUsersById) //obtener usuario por id, accede cualquiera
router.get('/me/profile',validar.verifyToken, validar.isAdminToken,  controllers.getMe) //obtener usuario logueado, accede propio usuario
router.put('/:id',validar.verifyToken, validar.isAdminToken, controllers.updateUser) // actualiza usuario por id, accede admin
router.put('/me/profile',validar.verifyToken, validar.isAdminToken,  controllers.updateMe) //actuializa usuario accede propio usuario
router.put('/me/password',validar.verifyToken, validar.isAdminToken, controllers.updatePassword) // Usuario cambia contraseña
router.put('/pass/restore',validar.verifyToken, validar.isAdminToken, controllers.restorePass) // Restaurar pass a usuario
router.delete('/',validar.verifyToken, validar.isAdminToken, controllers.deleteAllUser) //borra todos los usuarios, solo admin
router.delete('/:id',validar.verifyToken, validar.isAdminToken, controllers.deleteUser)//borra usuario por id accede admin
router.delete('/me/delete',validar.verifyToken, validar.isAdminToken,  controllers.deleteMe)//borra el usuario logueado

// Version con logueo desde frontend
// router.get('/', validar.isAuth, controllers.getUsers) // obtener todos los usuarios accede cualquiera
// router.get('/:id', validar.isAuth, controllers.getUsersById) //obtener usuario por id, accede cualquiera
// router.get('/me/profile', validar.isAuth, controllers.getMe) //obtener usuario logueado, accede propio usuario
// router.put('/:id', validar.isAuth, validar.isAdmin,controllers.updateUser) // actualiza usuario por id, accede admin
// router.put('/me/profile', validar.isAuth, controllers.updateMe) //actuializa usuario accede propio usuario
// router.put('/me/password', validar.isAuth,validar.validyPass,controllers.updatePassword) // Usuario cambia contraseña
// router.put('/pass/restore', validar.isAuth, validar.isAdmin, controllers.restorePass) // Restaurar pass a usuario
// router.delete('/', validar.isAuth, validar.isAdmin,controllers.deleteAllUser) //borra todos los usuarios, solo admin
// router.delete('/:id',validar.isAuth, validar.isAdmin, controllers.deleteUser)//borra usuario por id accede admin
// router.delete('/me/delete', validar.isAuth, controllers.deleteMe)//borra el usuario logueado


// Version sin logueo
// router.get('/',  controllers.getUsers) // obtener todos los usuarios accede cualquiera
// router.get('/:id',  controllers.getUsersById) //obtener usuario por id, accede cualquiera
// router.get('/me/profile',  controllers.getMe) //obtener usuario logueado, accede propio usuario
// router.put('/:id', controllers.updateUser) // actualiza usuario por id, accede admin
// router.put('/me/profile',  controllers.updateMe) //actuializa usuario accede propio usuario
// router.put('/me/password', controllers.updatePassword) // Usuario cambia contraseña
// router.put('/pass/restore', controllers.restorePass) // Restaurar pass a usuario
// router.delete('/', controllers.deleteAllUser) //borra todos los usuarios, solo admin
// router.delete('/:id', controllers.deleteUser)//borra usuario por id accede admin
// router.delete('/me/delete',  controllers.deleteMe)//borra el usuario logueado


module.exports= router