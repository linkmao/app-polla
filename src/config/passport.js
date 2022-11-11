// Este fragmento de codigo se encarga de toda la lógica del login, haciendo uso de la dependencia passport

const passport= require('passport')
const LocalStrategy = require('passport-local').Strategy  // Se trae solo la clase Strategy
const User = require('../models/User')  // se trae la clase user para su consulta

// Importante, los parametros de la funcion flecha se deben llamar estrictamente email, y password, ya que como se configura usernameField: emal, la strategia entiende que se recibiran esos tipos de datos, cabe anotar tambien que en el formulario frontend, lis inputs deberan tener tambien esos nombres

passport.use(new LocalStrategy({usernameField:'email'}, 
async (email, password, done) =>{
  const user= await User.findOne({email:email})  // Se hace la consulta para buscar si por lo menos el email existe
  if (!user) {
    console.log("correo no encontrado")
    return done(null, false,{message:"Correo no encontrado"})}
  else {
    // console.log(user)
      const match = await user.comparePass(password) // Uso del metodo comparePass de la instancia user
      if (match) {
        console.log("logueado")
        return done(null,user)} // si la contraseña coincide, se devuleve el usuario
      else {
        console.log("contraseña no coinidente")
        return done(null, false,{message:"Contraseña no coincidente"})} // Si no se devuelve false
  }
}))


passport.serializeUser((user,done)=>{done(null,user.id)})  // Se almacena el id del usuario
passport.deserializeUser((id,done)=>{// Toma el id del usuario logueado y guardado en serializeUser para tomar sus datos
 User.findById(id, (err,user)=>{
    done(err,user)
  })
})





