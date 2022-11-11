const Team = require('../models/Team')

const  getTeam = async (req, res)=>{
  const Teams = await Team.find()
  res.status(200).json(Teams) }

const getTeamById=async (req, res)=>{
  const TeamById = await Team.findById(req.params.id)
  res.status(200).json(TeamById) 
}  

const addTeam = async (req, res)=>{
    console.log(req.body)
    const {name, group, tag, flag}=req.body
    const newTeam=new Team({name, group, tag, flag})
    await newTeam.save()
    res.status(201).json({"message":"Equipo guardado"})}

const updateTeam  = async (req, res)=>{
  const teamUpdate = await Team.findByIdAndUpdate(req.params.id, req.body,{new:true}) 
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(teamUpdate)
  }

const deleteTeam = async (req, res)=>{
        await Team.findByIdAndDelete(req.params.id)
        res.status(200).send("Elemento "+ req.params.id + " borrado")}

const deleteAllTeam= async(req, res)=>{
  await Team.deleteMany()
  res.status(200).send('Todos los equipos fueron borrados')
}

module.exports = {getTeam, addTeam, updateTeam, deleteTeam, getTeamById, deleteAllTeam}