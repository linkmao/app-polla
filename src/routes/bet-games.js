const {Router}=require('express')
const router = Router()
const controller = require('../controllers/bet-games.js')
const validar = require('../midleware/validaciones')


//Version con token, via POSTMAN
// router.get('/',validar.verifyToken, controller.getAllBets) //obtiene todas los apuestas, accede cualquier usuario
// router.get('/me/bet', validar.verifyToken, controller.getMeBets) //obtiene todas las apuestas, usuario logueado
// router.get('/:id',validar.verifyToken, controller.getBetGameById)  //obtiene cualquier apuesta por id, cualquier user
// router.get('/user/:iduser',validar.verifyToken, validar.isAdminToken, controller.getBetGameByIdUser)  //obtiene todas las apuestas de un usuario (Solo admin)
// router.post('/me/bet', validar.verifyToken, controller.addMeBetGame ) //crea apuesta usuario logueado
// router.post('/:iduser', validar.verifyToken, validar.isAdminToken, controller.addBetGame) //crea apuesta a usuario con id ingresado por url, solo accede admmin
// router.put('/me/bet/:id', validar.verifyToken,controller.updateMeBetGame)//Actualiza apuesta usuario logueado
// router.put('/me/bet/:id/:game/:phase', validar.verifyToken, controller.updateMeBetGameAndNextGame)//Actualiza apuesta usuario logueado pero tambien permite asignar el equipo que clasifica para el siguiente partido, esto solo tiene utilidad para su uso desde el frontend
// router.put('/me/group/bet/:id/:g', validar.verifyToken,controller.updateMeBetGameGroup)//Actualiza apuesta usuario logueado y grupo del juego (ruta optimizada para el frontend)
// router.put('/:id', validar.verifyToken, validar.isAdminToken, controller.updateBetGame)
// router.delete('/me/bet/:id', validar.verifyToken,controller.deleteMeBetGame ) // Borra juego id accede usuario logueado
// router.delete('/me/bet', validar.verifyToken, controller.deleteAllMeBetGames ) //borra todos las apuestas de usuario logueado
// router.delete('/:id', validar.verifyToken, validar.isAdminToken, controller.deleteBetGame)//borra apuesta con id, accede admin
// router.delete('/admin/:iduser', validar.verifyToken, validar.isAdminToken, controller.deleteAllBetGameByIdUser) // Borrar todos los juegos de un usuario dado por id, accede admin
// router.delete('/', validar.verifyToken, validar.isAdminToken, controller.deleteAllBetGames) //Borra las apuestas de todos los usuarios



// // VERSION CON AUTENTICACION VIA FRONTEND
router.get('/',validar.isAuth, controller.getAllBets) //obtiene todas los apuestas, accede cualquier usuario
router.get('/me/bet', validar.isAuth, controller.getMeBets) //obtiene todas las apuestas, usuario logueado
router.get('/:id',validar.isAuth, controller.getBetGameById)  //obtiene cualquier apuesta por id, cualquier user
router.get('/user/:iduser',validar.isAuth, validar.isAdmin, controller.getBetGameByIdUser)  //obtiene todas las apuestas de un usuario (Solo admin)
router.post('/me/bet', validar.isAuth, controller.addMeBetGame ) //crea apuesta usuario logueado
router.post('/:iduser', validar.isAuth, validar.isAdmin, controller.addBetGame) //crea apuesta a usuario con id ingresado por url, solo accede admmin
router.put('/me/bet/:id', validar.isAuth,controller.updateMeBetGame)//Actualiza apuesta usuario logueado
router.put('/me/bet/:id/:game/:phase', validar.isAuth, controller.updateMeBetGameAndNextGame)//Actualiza apuesta usuario logueado pero tambien permite asignar el equipo que clasifica para el siguiente partido, esto solo tiene utilidad para su uso desde el frontend
router.put('/me/group/bet/:id/:g', validar.isAuth,controller.updateMeBetGameGroup)//Actualiza apuesta usuario logueado y grupo del juego (ruta optimizada para el frontend)
router.put('/:id', validar.isAuth, validar.isAdmin, controller.updateBetGame)
router.delete('/me/bet/:id', validar.isAuth,controller.deleteMeBetGame ) // Borra juego id accede usuario logueado
router.delete('/me/bet', validar.isAuth, controller.deleteAllMeBetGames ) //borra todos las apuestas de usuario logueado
router.delete('/:id', validar.isAuth, validar.isAdmin, controller.deleteBetGame)//borra apuesta con id, accede admin
router.delete('/admin/:iduser', validar.isAuth, validar.isAdmin, controller.deleteAllBetGameByIdUser) // Borrar todos los juegos de un usuario dado por id, accede admin
router.delete('/', validar.isAuth, validar.isAdmin, controller.deleteAllBetGames) //Borra las apuestas de todos los usuarios


// Version sin autenticacion
// router.get('/', controller.getAllBets) //obtiene todas los apuestas, accede cualquier usuario
// router.get('/me/bet', controller.getMeBets) //obtiene todas las apuestas, usuario logueado
// router.get('/:id', controller.getBetGameById)  //obtiene cualquier apuesta por id, cualquier user
// router.get('/user/:iduser', controller.getBetGameByIdUser)  //obtiene todas las apuestas de un usuario (Solo admin)
// router.post('/me/bet', controller.addMeBetGame ) //crea apuesta usuario logueado
// router.post('/:iduser', controller.addBetGame) //crea apuesta a usuario con id ingresado por url, solo accede admmin
// router.put('/me/bet/:id',controller.updateMeBetGame)//Actualiza apuesta usuario logueado
// router.put('/me/bet/group/:id/:g',controller.updateMeBetGameGroup)//Actualiza apuesta usuario logueado y grupo del juego (ruta optimizada para el frontend)
// router.put('/me/bet/:id/:game',controller.updateMeBetGameAndNextGame)//Actualiza apuesta usuario logueado pero tambien permite asignar el equipo que clasifica para el siguiente partido, esto solo tiene utilidad para su uso desde el frontend
// router.put('/:id', controller.updateBetGame)
// router.delete('/me/bet/:id', controller.deleteMeBetGame ) // Borra juego id accede usuario logueado
// router.delete('/me/bet',  controller.deleteAllMeBetGames ) //borra todos las apuestas de usuario logueado
// router.delete('/:id',  controller.deleteBetGame)//borra apuesta con id, accede admin
// router.delete('/admin/:iduser', controller.deleteAllBetGameByIdUser) // Borrar todos los juegos de un usuario dado por id, accede admin
// router.delete('/',  controller.deleteAllBetGames) //Borra las apuestas de todos los usuarios



module.exports= router
