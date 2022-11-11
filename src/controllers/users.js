const User= require('../models/User.js')

const getUsers=async (req, res)=>{
  const Users= await User.find()
  res.status(200).json(Users)
}

const getMe = async(req,res)=>{
  console.log(req.user.id)
  const me= await User.findById(req.user.id)
  res.status(200).json(me)
}

const getUsersById = async (req, res)=>{
  const UserById= await User.findById(req.params.id)
  res.status(200).json(UserById)
}


const updateUser  = async (req, res)=>{
  const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body,{new:true}) 
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(userUpdate)
  }

const updateMe= async(req, res)=>{
const meUpdate=await User.findByIdAndUpdate(req.user.id, req.body,{new:true} )
// res.status(200).json(meUpdate)
res.status(200).redirect('/games')
}

const deleteUser = async (req, res)=>{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send("Usuario "+ req.params.id + " borrado")}

const deleteAllUser= async(req, res)=>{
  await User.deleteMany()
  res.status(200).send('Todos los usuarios fueron borrados')
}

const deleteMe = async (req,res)=>{
  const meDelete=await User.findByIdAndRemove(req.user.id)
  res.status(200).json(meDelete)
}

const updatePassword = async (req,res)=>{
  const {actualPass, pass, verifyPass}= req.body
  const user= await User.findOne({_id:req.user.id})  // Se hace la consulta para buscar si por lo menos el email existe
  const match = await user.comparePass(actualPass) // Uso del metodo comparePass de la instancia user
      if (match) {
        console.log("SI puedes cambiar contraseña")
        const passUpdated=await User.findByIdAndUpdate(req.user.id, {pass: await User.encryptPass(pass)},{new:true} )
          // res.status(200).json(passUpdated)
         req.flash('mensajeOk', 'Contraseña cambiada exitosamente')
         res.status(200).redirect('/games')
       } // si la contraseña coincide, se devuleve el usuario
      else {
        console.log("NO puede cambiar contraseña")
        req.flash('mensajeError', 'Contraseña actual erronea')
        res.status(200).redirect('/password')
        } // Si no se devuelve false
  }


  const restorePass=async (req,res)=>{
     console.log("RESTAURANDO CONTRASEÑA")
      const {id, pass}= req.body
      const user= await User.findByIdAndUpdate(id,{pass:await User.encryptPass(pass)})
      req.flash('mensajeOk', 'Contraseña restablecida para jugador: ', user.name)
      res.status(200).redirect('/admin/pass-restore')
  }


module.exports = {getUsers, getMe, getUsersById, updateUser,updateMe, deleteAllUser, deleteUser, deleteMe, updatePassword, restorePass}