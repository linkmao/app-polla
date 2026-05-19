const User = require('../models/User')
const Game = require('../models/Game')
const Classification = require('../models/Classification')
const BetClassification = require('../models/Bet-classification')
const BetGame = require('../models/Bet-game')
const Key = require('../models/Key')

const signUp = async (req, res) => {
  const { email, pass, name, lastName, phone, key } = req.body

  // Verificamos si la llave proporcionada es la llave maestra de administrador en el .env
  let role = 'user'
  let isValidKey = false
  let dbKey = null

  if (key === process.env.KEY_ADMIN) {
    role = 'admin'
    isValidKey = true
  } else {
    // Si no es la llave admin, verificamos en la base de datos
    dbKey = await Key.findOne({ keyCode: key, isUsed: false })
    if (dbKey) {
      isValidKey = true
    }
  }

  if (isValidKey) {
    const newUser = new User({ email, pass: await User.encryptPass(pass), name, lastName, phone, role })
    await newUser.save()

    if (dbKey) {
      // Si se usó una llave de la BD, la actualizamos
      await Key.findByIdAndUpdate(dbKey._id, { idUser: newUser._id, isUsed: true }, { new: true })
    }

    // CREACION DE LOS DATOS PARA Bet-game y Bet-classification
    const games = await Game.find()
    const betGamesPromises = games.map(e => {
      const newBetGame = new BetGame({ idGame: e._id, idUser: newUser._id, localScore: -1, visitScore: -1, analogScore: "-1" })
      return newBetGame.save()
    })

    const classifications = await Classification.find()
    const betClassificationsPromises = classifications.map(e => {
      const newBetClassification = new BetClassification({ idUser: newUser._id, group: e.group, idClassification: e._id })
      return newBetClassification.save()
    })

    await Promise.all([...betGamesPromises, ...betClassificationsPromises])

    req.flash('mensajeOk', 'Registro exitoso. Inicia sesión')
    res.status(200).redirect('/')
  } else {
    req.flash('mensajeError', 'Llave no valida para registrarse')
    res.status(200).redirect('/')
  }
}

// controlador que permite la creación de un usuario tipo admin desde la api con la ruta auth/signup/admin
const signUpAdmin = async (req, res) => {
  // Para garantizar que solamente pueda crear cuentas tipo admin solo quien corra esta app (que se supone es el admin) se hace uso de una variable de entorno, eso garantiza que nadie diefente a quien tenga este código en local o producción pueda crear cuentas tipo admin
  const { email, pass, name, lastName, phone, key } = req.body
  if (key == process.env.CODE_FOR_CREATE_ADMIN) {
    const newUser = new User({ email, pass: await User.encryptPass(pass), name, lastName, phone, role: 'admin' })
    await newUser.save()
    res.status(200).json({ message: "User admin create" })
  }
  else {
    res.status(200).json({ message: "user admin is not create, wrong key" })
  }
}

// VERSION DE CODIGO CON JWEBTOKEN
const jwt = require('jsonwebtoken')
const config = require('../config/config')

// SIGNUOP USANDO LA ESTRATEGIA DEL TOKEN
// const signUp = async (req,res)=>{
//   const {email, pass, name, lastName, phone}= req.body
//   const newUser=new User({email, pass:await User.encryptPass(pass) , name, lastName, phone})
//   await newUser.save()
//   // Luego que se crea el usuario se le entrega un token, de esa manera ya queda logueado
//   const token = jwt.sign({id:newUser._id}, 
//     config.secretword,
//     {expiresIn:config.tokenDuration})  // Se configura para que el token solo dure un dia (puede ser menos)
//     // Retorno el token
//     res.status(200).json({token})
// }


// Signin usando token para e logueo del adminsitrador desde Postman
const signInAdmin = async (req, res) => {
  const { email, pass } = req.body
  // console.log(email, pass)
  const userFound = await User.findOne({ email })
  if (!userFound) {
    res.status(400).json({ message: "Usuario no registrado" })
  }
  else {
    const matchPass = await userFound.comparePass(pass, userFound.pass)
    if (matchPass) {
      const token = jwt.sign({ id: userFound._id },
        config.secretword,
        { expiresIn: config.tokenDuration })  // Se configura para que el token solo dure un dia (puede ser menos)
      // Retorno el token
      res.status(200).json({ token })
    }
    else
      res.status(200).json({ message: "Contraseña incorrecta" })
  }
}

module.exports = { signUp, signInAdmin, signUpAdmin }