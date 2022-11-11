const dotenv = require('dotenv')
const methodOverride = require('method-override')
const express = require('express')
const exphbs = require('express-handlebars') // Para el funcionamiento de handlebaras
const morgan = require('morgan')
const teams = require('./routes/teams')
const games = require('./routes/games')
const keys = require('./routes/keys')
const classifications = require('./routes/classifications')
const users = require('./routes/users')
const auth = require('./routes/auth')
const betGame = require('./routes/bet-games')
const betClassification = require('./routes/bet-classifications')
const index = require('./routes/index')
const flash = require('connect-flash') // Para el envio de mensajes del backend al frontend
const passport = require('passport') // Passport y sus dependencias auxiliares
const session = require('express-session') // Passport y sus dependencias auxiliares
const path = require('path') // para la obtencion de rutas del proyecto
// const cors = require('cors');
const {verifyPhaseCompleted}= require('./controllers/index')

const app = express()

dotenv.config() // Permite que funcionen las variables de entorno

// Configuracion
require('./config/database') // codigo de configuracion base de datos
require('./config/passport') // codigo de configuracion de passport

//Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))


// Configuracion del motor de plantilla html
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main.hbs',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}))
app.set('view engine', '.hbs') // con esta linea queda lista la configuracion del motor de plantilla

//Midleware
// app.use(morgan('dev')) // Permite monitorear el tipo de peticion que se estpa haciendo

app.use(express.json()) // Permite que el servidor pueda responder con json
app.use(express.static(app.get('public'))) //Configuracion carpeta publica (archivos estaticos) 
app.use(express.urlencoded({ extended: true })) // envio de datos de fomrulario al backend
app.use(methodOverride('_method')) //// envio de datos de fomrulario al backendn (para put y delete)
app.use(session({
  secret: 'Este es un texto cualquiera que deberia creo yo estar en una variable de entorno',
  resave: true,
  saveUninitialized: true
}))  // Aun no comprendo bien para que es session
app.use(flash()) // Para el envio de mensajes
app.use(passport.initialize()) // Para usa passport
app.use(passport.session())  // para usar passport con session

app.use(async (req, res, next)=>{
  const data=req.user||null
  if (data){
  res.locals.octavosCompleted=(await  verifyPhaseCompleted(data._id)).octavosCompleted
  res.locals.cuartosCompleted=(await  verifyPhaseCompleted(data._id)).cuartosCompleted
  res.locals.semiCompleted=(await  verifyPhaseCompleted(data._id)).semiCompleted
  console.log(res.locals.semiCompleted)
  }
  next()
})


// Variables locales, estas variables son datos que se envian desde el backend y que podrán usarse en el frontend, ntese que esto es un midleware, significa que esta infomacion se actualiza despues de cada peticion de las rutas
app.use((req, res, next) => {
  res.locals.mensajeError = req.flash('mensajeError')
  res.locals.mensajeOk = req.flash('mensajeOk')
  res.locals.localUsuario = req.user || null // Se guarda el user que envia passport, y se guarda en una variable local
  res.locals.localBody=req.body || null
  // const temporal=res.locals.localBody
  // console.log("BODY GUARDADO: ", temporal)
   // Cuando se quuiere acceder en handlebars a usuario.name, no permite su uso, entonces se guadan todos los datos de usuario en variables locales así como se muestra a continuación
  if (res.locals.localUsuario != null) {
    const data = res.locals.localUsuario
    res.locals.localName = data.name
    res.locals.localLastName = data.lastName
    res.locals.localPhone = data.phone
    res.locals.localEmail = data.email
    res.locals.localId = data._id
    res.locals.localAdmin = (data.role=='admin') ? data.role : null 
  }

  // HASTA QUE NO TENGA UNA COMPRENSIÓN DE REQ RES EN LOS MIDDLEWARE ME CUESTA ESTA PEQUEÑA LOGICA PARA LA PERSISTENCIA DE DATOS
  
  // if (temporal.name=="Mauricio"){
  //   console.log("NAME QUE VIENE DE BODY: ", temporal.name )
  //   console.log("NOMBRE TEMPORAL: ", temporal.lastName)
  //   res.locals.localInputName=temporal.name
  //   res.locals.localInputLastName=temporal.lastName
  // }
  next()
})

// app.use( (req, res, next)=> {
//   console.log('Time:', Date.now());
//   next();
// })

//rutas
app.use('/', index)
app.use('/auth', auth)
app.use('/api/teams', teams)
app.use('/api/keys', keys )
app.use('/api/games', games)
app.use('/api/classifications', classifications)
app.use('/api/users', users)
app.use('/api/bet-games', betGame)
app.use('/api/bet-classifications', betClassification)


//Iniciode del servidor
app.listen(app.get('port'), () => { console.log('app escuchando en el puerto ' + app.get('port')) })

