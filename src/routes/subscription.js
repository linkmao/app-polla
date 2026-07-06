const { Router } = require('express')
const router = Router()
const webpush = require('../config/notification_service')

let pushSubscription
router.post('/subscribe', async (req, res) => {
  pushSubscription = req.body
  res.status(200).json({ message: 'subscipcion hecha en backend' })
  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify({
      title: 'Polla mundialista 2026',
      message: 'Se han activado las notificaciones'
    }))
  } catch (error) {
    console.error('Error al enviar la notificación:', error)
  }
})

router.post('/send-notification', async (req, res) => {
  const { title, message } = req.body
  const payload = JSON.stringify({ title, message })
  res.status(200).json({ message: 'Notificación enviada' })
   try {
    await webpush.sendNotification(pushSubscription,payload)
    // console.log('Notificación enviada con éxito')
  } catch (error) {
    console.error('Error al enviar la notificación:', error)
  }
}
  
)

module.exports = router
