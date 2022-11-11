const {Schema, model}= require('mongoose')

const TeamSchema= new Schema({
    name:{type:String,required:true },
    group: {type:String, required:true},
    tag:{type:String},   // Este es de uso opcional guarda algun tipo de identificador propio del toneo como A1, B2 etc
    flag:{type:String, dafault:"no-flag"},
    active:{type:Boolean, default:true},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)

module.exports = model('Team', TeamSchema)