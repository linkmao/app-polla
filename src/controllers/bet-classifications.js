const BetClassification = require('../models/Bet-classification')

const getAllClassifications = async (req,res)=>{
  const allClassification= await BetClassification.find()
  res.status(200).json(allClassification)
}

const  getMeClassification = async (req, res)=>{
  const meClassification = await BetClassification.find({idUser:req.userId})
  res.status(200).json(meClassification) }

const getClassificationById=async (req, res)=>{
  const betClassification = await BetClassification.findById(req.params.id)
  res.status(200).json(betClassification) 
}  

const addMeClassification = async (req, res)=>{
    const {group, firstTeam, secondTeam, thirdTeam}=req.body
    const newMeClassification=new BetClassification({idUser:req.userId,group, firstTeam, secondTeam, thirdTeam})
    await newMeClassification.save()
    res.status(201).json(newMeClassification)}

const addClassification = async (req,res)=>{
  const {group, firstTeam, secondTeam, thirdTeam}=req.body
  const newClassification=new BetClassification({idUser:req.params.iduser,group, firstTeam, secondTeam, thirdTeam})
  await newClassification.save()
  res.status(201).json(newClassification)
}

const updateMeClassification  = async (req, res)=>{
  const meClassificationUpdated = await BetClassification.findOneAndUpdate( {idUser:req.userId, _id:req.params.id, }, req.body,{new:true}) 
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(meClassificationUpdated)
  }

const updateClassification= async(req,res)=>{
  const classificationUpdated = await BetClassification.findOneAndUpdate( {_id:req.params.id, }, req.body,{new:true}) 
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(classificationUpdated)
}

const deleteMeClassification = async (req, res)=>{
        const classificationMeDeleted= await BetClassification.findOneAndDelete({idUser:req.userId, _id:req.params.id})
        // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.userId + " ha sido borrado" )
        res.status(200).json(classificationMeDeleted)
}

const deleteAllMeClassifications= async(req, res)=>{
  await BetClassification.deleteMany({idUser:req.userId})
  res.status(200).send('Todos las classificaciones del usuario '+ req.userId + " fueron borrados")
}

const deleteClassification = async (req, res)=>{
  const classificationDeleted= await BetClassification.findOneAndDelete({_id:req.params.id})
  // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.userId + " ha sido borrado" )
  res.status(200).json(classificationDeleted)
}

const deleteAllClassifitationsByIdUser = async (req,res)=>{
  await BetClassification.deleteMany({idUser:req.params.iduser})
  res.status(200).send('Todas las clasificaciones del jugador'+req.params.iduser+ " fueron borradas")
}

const deleteAllClassifications= async(req, res)=>{
  await BetClassification.deleteMany()
  res.status(200).send('Todos las las classificaciones de todos los jugadores fueron borradas')
}

module.exports = {getAllClassifications, getMeClassification, getClassificationById, addMeClassification,addClassification , updateMeClassification,updateClassification, deleteMeClassification, deleteAllMeClassifications, deleteClassification, deleteAllClassifitationsByIdUser, deleteAllClassifications }