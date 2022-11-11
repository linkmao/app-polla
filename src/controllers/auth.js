const User = require ('../models/User')
const Game = require('../models/Game')
const Classification= require('../models/Classification')
const BetClassification = require('../models/Bet-classification')
const BetGame=require('../models/Bet-game')
const Key = require('../models/Key')

const signUp = async (req,res)=>{
  const {email, pass, name, lastName, phone, key}= req.body
  const newUser=new User({email, pass:await User.encryptPass(pass) , name, lastName, phone})
  await newUser.save()

  // Se verifica la llave para validar la creación del usuario
 const keys= await Key.find({keyCode:key, isUsed:false})
 if (keys[0]!=null){
  // Actualizo la key con el id del usuario registrado
  await Key.findByIdAndUpdate(keys[0]._id,{idUser:newUser._id,isUsed:true},{new:true})
// La siguiente seccion de codigo lo que hace es generar la estructura de la apuesta inicial para el jugador recien logueado, se espera el futuras versiones hacer esta implementacion en un midleware independinete
  
  // CREACION DE LOS DATOS PARA Bet-game
  //Nota del 29 de agsoto de 2022. Inicialmente la estructura de apuesta que se le cargaba al jugador era solo el correspondiente a  la fase inicial, para ello se usaba en la consulta del modelo Game la siguiente sintaxis Game.find({phase:config.phaseInitial}), sin embargo analizando postetiormente y para no tener que crear otra estructura cuando las apuestas sean de las demás fases, se opta por que se cargue al jugador previamente registrado. TODA LA ESTRUCTURA DE LOS JUEGos, es decir todos los 64 partidos, la forma de diferenciar cada etapa está en la propiedad phase del modelo Game
  const games = await Game.find()
  games.forEach( async (e,i)=>{
  const newBetGame=new BetGame({idGame:e._id,idUser:newUser._id,localScore:-1, visitScore:-1, analogScore:"-1"})
  await newBetGame.save()
  })
  
  // CREACION DE LOS DATOS PARA Bet-classification
   const classification = await Classification.find()
   classification.forEach(async e=>{
   const newBetClassification = new BetClassification({idUser:newUser._id, group:e.group, idClassification:e._id})
   await newBetClassification.save()
   })

  req.flash('mensajeOk','Registro exitoso. Inicia sesión')
  res.status(200).redirect('/')    // Luego de registrado se redirige a la pnatalla principal para que haga loguin, sin empbargoo luego lo haré oara que inmediatamente ingrese a su app

} else {
  // Borro el usuario creado, pues no tiene la llave
  await User.findByIdAndDelete(newUser._id)
  req.flash('mensajeError','Llave no valida para registrarse')
  res.status(200).redirect('/')
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
const signInAdmin = async (req, res)=>{
  const {email, pass}= req.body
  console.log(email, pass)
  const userFound= await User.findOne({email})
  if (!userFound) { 
   res.status(400).json({message:"Usuario no registrado"})
  }
  else {
    const matchPass = await userFound.comparePass(pass, userFound.pass)
    if (matchPass){
    const token = jwt.sign({id:userFound._id}, 
    config.secretword,
    {expiresIn:config.tokenDuration})  // Se configura para que el token solo dure un dia (puede ser menos)
    // Retorno el token
    res.status(200).json({token})
    }
    else
    res.status(200).json({message:"Contraseña incorrecta"})
  }
}


module.exports =  {signUp, signInAdmin}