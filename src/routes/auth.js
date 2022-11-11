const {Router} = require('express')
const auth=require('../controllers/auth')
const router = Router()
const validar= require('../midleware/validaciones')
const passport= require('passport')

router.post('/signup',  validar.validyPass, validar.validityEmail,auth.signUp)
// router.post('/signin', auth.signIn)


// No se como poner a funcionar los mensajes flash con el uso de passport
router.post('/signin',passport.authenticate('local',{
  successRedirect:'../../routegames',
  failureRedirect:'../../',
  failureFlash:true
}), (req,res)=> {req.flash('mensajeError','Usuario o contraseña no valido')})

// Ruta que se accede solo por medio de postman para entrega de token
router.post('/signin/admin', auth.signInAdmin)


// Desde la version 0.6 de passport, se requiere de un callback para logout, tal como se muestra en este codigo
router.get('/logout',(req,res, next)=>{
  req.logout(err=>{
    if(err) {return next(err)}
    res.redirect('/')
  })
})



module.exports = router