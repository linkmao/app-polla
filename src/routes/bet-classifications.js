const {Router}=require('express')
const router = Router()
const controller = require('../controllers/bet-classifications.js')
const validar = require('../midleware/validaciones')

//VERSION CON VALIDACIÓN TOKEN, VIA POSTMAN
// router.get('/',validar.verifyToken, controller.getAllClassifications) //obtiene todas los apuestas, accede cualquier usuario
// router.get('/me/bet', validar.verifyToken, controller.getMeClassification) //obtiene todas las apuestas, usuario logueado
// router.get('/:id',validar.verifyToken, controller.getClassificationById)  //obtiene cualquier apuesta por id, cualquier user
// router.get('/user/:id',validar.verifyToken, validar.isAdminToken, controller.getClassificationByUserId)  //obtiene las apuestas de un usuario id (admin)
// router.post('/me/bet', validar.verifyToken, controller.addMeClassification ) //crea apuesta usuario logueado
// router.post('/:iduser', validar.verifyToken, validar.isAdminToken, controller.addClassification) //crea apuesta a usuario con id ingresado por url, solo accede admmin
// router.put('/me/bet/:id', validar.verifyToken,  controller.updateMeClassification)//Actualiza apuesta usuario logueado
// router.put('/me/bet/group/:g', validar.verifyToken,validar.isTeamDiferent,controller.updateMeBetClassificationGroup)//Actualiza apuesta usuario logueado y grupo del juego (ruta optimizada para el frontend)
// router.put('/:id', validar.verifyToken, validar.isAdminToken, controller.updateClassification)
// router.delete('/me/bet/:id', validar.verifyToken,controller.deleteMeClassification ) // Borra juego id accede usuario logueado
// router.delete('/me/bet', validar.verifyToken, controller.deleteAllMeClassifications ) //borra todos las apuestas de usuario logueado
// router.delete('/:id', validar.verifyToken, validar.isAdminToken, controller.deleteClassification)//borra apuesta con id, accede admin
// router.delete('/user/:iduser', validar.verifyToken, validar.isAdminToken, controller.deleteAllClassifitationsByIdUser) // Borrar todos las clasificaciones de un usuario dado por id, accede admin
// router.delete('/', validar.verifyToken, validar.isAdminToken, controller.deleteAllClassifications) //Borra las apuestas de todos los usuarios


// VERSION CON AUTENTICACION PARA EL FRONTEND
router.get('/',validar.isAuth, controller.getAllClassifications) //obtiene todas los apuestas, accede cualquier usuario
router.get('/me/bet', validar.isAuth, controller.getMeClassification) //obtiene todas las apuestas, usuario logueado
router.get('/:id',validar.isAuth, controller.getClassificationById)  //obtiene cualquier apuesta por id, cualquier user
router.get('/user/:id',validar.isAuth, validar.isAdmin, controller.getClassificationByUserId)  //obtiene las apuestas de un usuario id (admin)
router.post('/me/bet', validar.isAuth, controller.addMeClassification ) //crea apuesta usuario logueado
router.post('/:iduser', validar.isAuth, validar.isAdmin, controller.addClassification) //crea apuesta a usuario con id ingresado por url, solo accede admmin
router.put('/me/bet/:id', validar.isAuth,  controller.updateMeClassification)//Actualiza apuesta usuario logueado
router.put('/me/bet/group/:g', validar.isAuth,validar.isTeamDiferent,controller.updateMeBetClassificationGroup)//Actualiza apuesta usuario logueado y grupo del juego (ruta optimizada para el frontend)
router.put('/:id', validar.isAuth, validar.isAdmin, controller.updateClassification)
router.delete('/me/bet/:id', validar.isAuth,controller.deleteMeClassification ) // Borra juego id accede usuario logueado
router.delete('/me/bet', validar.isAuth, controller.deleteAllMeClassifications ) //borra todos las apuestas de usuario logueado
router.delete('/:id', validar.isAuth, validar.isAdmin, controller.deleteClassification)//borra apuesta con id, accede admin
router.delete('/user/:iduser', validar.isAuth, validar.isAdmin, controller.deleteAllClassifitationsByIdUser) // Borrar todos las clasificaciones de un usuario dado por id, accede admin
router.delete('/', validar.isAuth, validar.isAdmin, controller.deleteAllClassifications) //Borra las apuestas de todos los usuarios

//VERSION SIN AUTENTICACION
// router.get('/', controller.getAllClassifications) //obtiene todas los apuestas, accede cualquier usuario
// router.get('/me/bet',  controller.getMeClassification) //obtiene todas las apuestas, usuario logueado
// router.get('/:id', controller.getClassificationById)  //obtiene cualquier apuesta por id, cualquier user
// router.get('/user/:id', controller.getClassificationByUserId)  //obtiene las apuestas de un usuario id (admin)
// router.post('/me/bet', controller.addMeClassification ) //crea apuesta usuario logueado
// router.post('/:iduser',  controller.addClassification) //crea apuesta a usuario con id ingresado por url, solo accede admmin
// router.put('/me/bet/:id',controller.updateMeClassification)//Actualiza apuesta usuario logueado
// router.put('/:id',  controller.updateClassification)
// router.delete('/me/bet/:id', controller.deleteMeClassification ) // Borra juego id accede usuario logueado
// router.delete('/me/bet', controller.deleteAllMeClassifications ) //borra todos las apuestas de usuario logueado
// router.delete('/:id',  controller.deleteClassification)//borra apuesta con id, accede admin
// router.delete('/user/:iduser',  controller.deleteAllClassifitationsByIdUser) // Borrar todos las clasificaciones de un usuario dado por id, accede admin
// router.delete('/',  controller.deleteAllClassifications) //Borra las apuestas de todos los usuarios

module.exports= router
