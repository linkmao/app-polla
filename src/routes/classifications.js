const {Router}=require('express')
const router = Router()
const controller = require('../controllers/classifications.js')
const validar = require('../midleware/validaciones')

// Version con autenticacion con token via POSTMAN
router.get('/', validar.verifyToken,validar.isAdminToken,  controller.getClassification )
router.get('/:id', validar.verifyToken,validar.isAdminToken, controller.getClassificationById)
router.post('/',  validar.verifyToken,validar.isAdminToken,controller.addClassification )
router.put('/:id',  validar.verifyToken,validar.isAdminToken,controller.updateClassification)
router.delete('/:id',  validar.verifyToken,validar.isAdminToken,controller.deleteClassification )
router.delete('/',  validar.verifyToken,validar.isAdminToken,controller.deleteAllClassifications )

// Version con autenticacion por frontend
// router.get('/', validar.isAuth, controller.getClassification )
// router.get('/:id',validar.isAuth, controller.getClassificationById)
// router.post('/', validar.isAuth, validar.isAdmin,controller.addClassification )
// router.put('/:id', validar.isAuth, validar.isAdmin,controller.updateClassification)
// router.delete('/:id', validar.isAuth, validar.isAdmin,controller.deleteClassification )
// router.delete('/', validar.isAuth, validar.isAdmin,controller.deleteAllClassifications )

//Version sin autenticacaion
// router.get('/', controller.getClassification )
// router.get('/:id', controller.getClassificationById)
// router.post('/', controller.addClassification )
// router.put('/:id', controller.updateClassification)
// router.delete('/:id', controller.deleteClassification )
// router.delete('/', controller.deleteAllClassifications )

module.exports= router
