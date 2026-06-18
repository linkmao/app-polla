const NOTIFICATION_PUBLIC_KEY = 'BLF7uS2YNGoCCtNFFxsBZtie_v_Aeso0zuK2s9s5ZP7vIndi_zZQFkXWuWx8DOCRj304LOzkPFTmaADaTZk1DBo'

const subscription=async () =>{
const register=await navigator.serviceWorker.register('./worker.js',{
   scope:'/'
 })

 const subscriptionReady = await register.pushManager.subscribe({
  userVisibleOnly:true,
  applicationServerKey:NOTIFICATION_PUBLIC_KEY
 })

  await fetch('/api/notification/subscribe',{
    method:'POST',
    body:JSON.stringify(subscriptionReady),
    headers:{
      "Content-Type":"application/json"
    }
  })
  console.log('subscipcion hecha en public')
  }

subscription()