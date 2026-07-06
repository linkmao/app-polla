self.addEventListener('push',e=>{
  const data=e.data.json()
  // console.log(data)
  self.registration.showNotification(data.title,{
    body:data.message,
    icon:'/img/iconos/polla-2026png.png'
    // icon:'cdn-icons-png.flaticon.com/512/5968/5968672.png'

  })
  
  
  // console.log('esta es la data del worker',data)
})