self.addEventListener('push',e=>{
  const data=e.data.json()
  console.log(data)
  self.registration.showNotification(data.title,{
    body:data.message,
    // icon:'./img/iconos/polla-2026.jpg'

  })
  console.log('notificacion recibida en worker')
})