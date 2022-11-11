const BetClassification = require('../models/Bet-classification')

const getAllClassifications = async (req, res) => {
  const allClassification = await BetClassification.find()
  res.status(200).json(allClassification)
}

const getMeClassification = async (req, res) => {
  const meClassification = await BetClassification.find({ idUser: req.user.id })
  res.status(200).json(meClassification)
}

const getClassificationById = async (req, res) => {
  const betClassification = await BetClassification.findById(req.params.id)
  res.status(200).json(betClassification)
}

const getClassificationByUserId = async (req, res) => {
  const betClassificationByUser = await BetClassification.find({ idUser: req.params.id })
  res.status(200).json(betClassificationByUser)
}

const addMeClassification = async (req, res) => {
  const { group, firstTeam, secondTeam, thirdTeam, fourthTeam } = req.body
  const newMeClassification = new BetClassification({ idUser: req.user.id, group, firstTeam, secondTeam, thirdTeam, fourthTeam })
  await newMeClassification.save()
  res.status(201).json(newMeClassification)
}

const addClassification = async (req, res) => {
  const { group, firstTeam, secondTeam, thirdTeam, fourthTeam } = req.body
  const newClassification = new BetClassification({ idUser: req.params.iduser, group, firstTeam, secondTeam, thirdTeam, fourthTeam })
  await newClassification.save()
  res.status(201).json(newClassification)
}

const updateMeClassification = async (req, res) => {
  const meClassificationUpdated = await BetClassification.findOneAndUpdate({ idUser: req.user.id, _id: req.params.id, }, req.body, { new: true })
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(meClassificationUpdated)
}

// Este controlador es para que la vista del frontend lleve nuevamente al ver los datos del grupo actuaizado
const updateMeBetClassificationGroup = async (req, res) => {
  await BetClassification.findOneAndUpdate({ idUser: req.user.id, group: req.params.g }, req.body, { new: true })
  const group = req.params.g
  // console.log(req.params.id)
  if (group != "FINAL") {
    res.redirect(`/groups/${group}#class`)
  }
  else {
    res.redirect('/finals')
  }
}


// const updateMeBetGameGroup  = async (req, res)=>{
//   const gameMeBetUpdate = await BetGame.findOneAndUpdate( {idUser:req.user.id, _id:req.params.id }, req.body,{new:true}) 
//   const group = req.params.g
//   res.redirect(`/groups/${group}`)
//   }



const updateClassification = async (req, res) => {
  const classificationUpdated = await BetClassification.findOneAndUpdate({ _id: req.params.id, }, req.body, { new: true })
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(classificationUpdated)
}

const deleteMeClassification = async (req, res) => {
  const classificationMeDeleted = await BetClassification.findOneAndDelete({ idUser: req.user.id, _id: req.params.id })
  // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.user.id + " ha sido borrado" )
  res.status(200).json(classificationMeDeleted)
}

const deleteAllMeClassifications = async (req, res) => {
  await BetClassification.deleteMany({ idUser: req.user.id })
  res.status(200).send('Todos las classificaciones del usuario ' + req.user.id + " fueron borrados")
}

const deleteClassification = async (req, res) => {
  const classificationDeleted = await BetClassification.findOneAndDelete({ _id: req.params.id })
  // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.user.id + " ha sido borrado" )
  res.status(200).json(classificationDeleted)
}

const deleteAllClassifitationsByIdUser = async (req, res) => {
  await BetClassification.deleteMany({ idUser: req.params.iduser })
  res.status(200).send('Todas las clasificaciones del jugador' + req.params.iduser + " fueron borradas")
}

const deleteAllClassifications = async (req, res) => {
  await BetClassification.deleteMany()
  res.status(200).send('Todos las las classificaciones de todos los jugadores fueron borradas')
}

module.exports = { getAllClassifications, getMeClassification, getClassificationById, addMeClassification, addClassification, updateMeClassification, updateClassification, deleteMeClassification, deleteAllMeClassifications, deleteClassification, deleteAllClassifitationsByIdUser, deleteAllClassifications, getClassificationByUserId, updateMeBetClassificationGroup }