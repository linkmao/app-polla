const {Schema, model}= require('mongoose')
const bcrypt= require('bcryptjs')

const UserSchema= new Schema({
    email:{type:String, required:true, unique:true},
    pass:{type:String, required:true},
    name:{type:String,required:true },
    lastName:{type:String,required:true },
    phone: {type:String, required:true},
    role:{type:String,default:'user'},
    active:{type:Boolean, default:true},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)

// a continuacion se crean dos "metodos" para UserSchema que permitirá la encriptación y la comparacion de las contraseñas

// Metodo estatico es decir que se puede invocar solo con la clase User
UserSchema.statics.encryptPass = async (pass)=>{
    const salt = await bcrypt.genSalt(10)  // se crea un salt
    return bcrypt.hash(pass, salt) // Se devuelve la contraseña encriptada
}

// Este metodo no es estatico, eso significa que se invoca solo cuando se instancia un objeto de la clase User
// No se debe usar la funcion flecha, se debe usar la notacion function para que se pueda acceder a los datos de elemento instanciado con la palabra clave this
UserSchema.methods.comparePass = async function(password)   {
    return await bcrypt.compare(password, this.pass) // solo se recibe el pass introducido, el sistema lo compara con el pass del usuario automaticamente con this.pass
}

module.exports = model('User', UserSchema)