require('dotenv').config()
const webpush=require('web-push')
webpush.setVapidDetails('mailto:maospace@proton.me',process.env.NOTIFICATION_PUBLIC_KEY,process.env.NOTIFICATION_PRIVATE_KEY)

module.exports= webpush