const { Router } = require('express')
const router = Router()
const webpush = require('../config/notification_service')
// const controller = require('../controllers/classifications.js')
// const validar = require('../midleware/validaciones')

let pushSubscription
router.post('/subscribe', async (req, res) => {
  pushSubscription = req.body
  res.status(200).json({message:'subscipcion hecha en backend'})
  console.log(req.body)


  try{
    await webpush.sendNotification(pushSubscription, JSON.stringify({
    title: 'Notificacion de prueba',
    message: 'Esta es una notificacion de prueba desde el backend'
  }))

  } catch (error) {
    console.error('Error al enviar la notificación:', error)
  }

  
})

// Version con autenticacion por frontend
// router.get('/', validar.isAuth, controller.getClassification)
// router.get('/:id', validar.isAuth, controller.getClassificationById)
// router.post('/', validar.isAuth, validar.isAdmin, controller.addClassification)
// router.put('/:id', validar.isAuth, validar.isAdmin, controller.updateClassification)
// router.delete('/:id', validar.isAuth, validar.isAdmin, controller.deleteClassification)
// router.delete('/', validar.isAuth, validar.isAdmin, controller.deleteAllClassifications)

//Version sin autenticacaion
// router.get('/dev/postman', controller.getClassification)
// router.get('/dev/postman/:id', controller.getClassificationById)
// router.post('/dev/postman', controller.addClassification)
// router.put('/dev/postman/:id', controller.updateClassification)
// router.delete('/dev/postman/:id', controller.deleteClassification)
// router.delete('/dev/postman', controller.deleteAllClassifications)

module.exports = router
