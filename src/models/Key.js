const {Schema, model}= require('mongoose')

const KeySchema= new Schema({
    keyNumber:{type:Number, required:true, unique:true},
    keyCode:{type:String, required:true, unique:true},
    isUsed:{type:Boolean, default:false},
    idUser:{type:String, default:""},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)


module.exports = model('Key', KeySchema)