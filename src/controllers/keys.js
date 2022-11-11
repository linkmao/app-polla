const Key = require('../models/Key')

const  getKey = async (req, res)=>{
  const Keys = await Key.find()
 res.json(Keys)
}

const getKeyById=async (req, res)=>{
  const KeyById = await Key.findById(req.params.id)
  res.status(200).json(KeyById) 
}  

const addKey = async (req, res)=>{
    const {keyNumber, keyCode}=req.body
    const newKey=new Key({keyNumber, keyCode})
    await newKey.save()
    res.status(201).json({"message":"Key creada"})}

const updateKey  = async (req, res)=>{
    const keyUpdate = await Key.findByIdAndUpdate(req.params.id, req.body,{new:true})
    res.status(200).json(keyUpdate)
  }

const deleteKey = async (req, res)=>{
        await Key.findByIdAndDelete(req.params.id)
        res.status(200).send("Key con id "+ req.params.id + "ha sido borrado")}

const deleteAllKey= async(req, res)=>{
  await Key.deleteMany()
  res.status(200).send('Todas las key fueron borrados')
}

module.exports = {getKey, getKeyById, addKey, updateKey, deleteKey, deleteAllKey}