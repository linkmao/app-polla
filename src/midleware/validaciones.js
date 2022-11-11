const jwt= require ('jsonwebtoken')
const  config =require( '../config/config')
const User = require('../models/User')
const Key = require('../models/Key')


//VALIDACION USANDO TOKEN, POR EL MOMENTO SE OMITE

 const verifyToken = async (req,res,next)=>{
    const token= req.headers["x-access-token"]
    if (!token) return res.status(403).json({message:'Token no encontrado'})
    const decoded= jwt.verify(token, config.secretword)  // Al decodificar obtiene el id del usuario identificado
    req.userId = decoded.id  // Es importante guardar este dato en el req, para que los demás midlewares puedan acceder a ese valor desde req
    const user=await User.findById(req.userId, {password:0})  //{password:0 }- es para que el retorno del suaurio no tenga la contraseña
    if (!user) return res.status(404).json({message:'Usuario no existe'})
    next()
}

const isAdminToken = async (req,res,next)=>{
    const user = await User.findById(req.userId)
    console.log(user.role)
    if (user.role!="admin")
    return res.status(403).json({message:'No tienes privilegios de administarador para la operacion'})
    next()
}




const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.status(404).redirect('/')
}

// Valida si los equipos que se envian para elegor el orden de la clasificacion sean todos difernetes

const isTeamDiferent=(req, res, next)=>{
const {firstTeam, secondTeam, thirdTeam, fourthTeam}= req.body
// Se realiza la comparación de 6 posibiidades de coincidencia con la primera que se cumpla se activa flag
let isDiferent= true
{firstTeam==secondTeam? isDiferent=false: isDiferent}
{firstTeam==thirdTeam? isDiferent=false: isDiferent}
{firstTeam==fourthTeam? isDiferent=false: isDiferent}
{secondTeam==thirdTeam? isDiferent=false: isDiferent}
{secondTeam==fourthTeam? isDiferent=false: isDiferent}
{thirdTeam==fourthTeam? isDiferent=false: isDiferent}
if (isDiferent) {next()} else
{req.flash('mensajeError', 'La clasificación no ha sido guardada. Verificar que no se repitan equipos en la elección de la clasificación.')
if (req.params.g!="FINAL")  
{res.redirect(`/groups/${req.params.g}`)}  // Si es de grupos, se renderiza nuevamente el grupo
else
{res.redirect('/finals')} // Si no, entonces es de la fase final
}
}

//VALIDANDO ADMIN USANDO EL TOKEN, POR EL MOMENTO INUTILIZADO
// const isAdmin = async (req,res,next)=>{
//     const user = await User.findById(req.userId)
//     console.log(user.role)
//     if (user.role!="admin")
//     return res.status(403).json({message:'No tienes privilegios de administarador para la operacion'})
//     next()
// }

const isAdmin = (req, res, next) => {
    if (req.user.role != "admin")
        return res.status(403).json({ message: 'No tienes privilegios de administarador para la operacion' })
    next()
}


const isKeyUsed = (req, res, next)=>{
    
}

// Valida que las dos contraseñas sean iguales al momento del registro

// IMPORTANTE... DEBO BUSCAR LA MANERA DE LLECAR LOS DATOS DEL BODY A LA PÁGINA, CON RES.RENDER FUNCIONA, PERO CON REDIRECT NO.....
const validyPass = (req, res, next) => {
    const { pass, passVerify } = req.body
    if (pass===""){
        req.flash('mensajeError', 'La nueva contraseña no puede estar vacia')
        res.redirect('/password')
    }else {

    if (pass !== passVerify) {
        // Este condicional se usa para la verificacion de igualdas de contraseñas en el cambio de contraseña
        if (req.body.actualPass) {
            req.flash('mensajeError', 'La nueva contraseña no coincide con su verificación')
            return res.redirect('/password')
        }
        // Esta sino se usa para la verificacion de igualdad de contraselas en el signup
        else {
            req.flash('mensajeError', 'Las contraseñas ingresadas no son iguales')
            return res.redirect('/signup')
        }

    }
    // {name:req.body.name, lastName:req.body.lastName, phone:req.body.phone,email:req.body.email, pass:req.body.pass, passVerify:""}
    // return res.status(400).json({message:'Contraseñas no coinciden'})
    next()
}
}


// midleware que se encarga de validar si el correo que ingresan ya existe
const validityEmail = async (req, res, next) => {
    const email = await User.findOne({ email: req.body.email })
    if (email) {
        req.flash('mensajeError', 'El correo ya existe')
        return res.redirect('/signup')
        //  {name:req.body.name, lastName:req.body.lastName, phone:req.body.phone,email:"", pass:req.body.pass, passVerify:req.body.passVerify}
        //  return res.status(400).json({message:'El correo ya existe'})
    }
    next()
}





module.exports = { isAuth, isAdmin, validityEmail, validyPass, isTeamDiferent, verifyToken, isAdminToken }