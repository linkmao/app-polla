const {Schema, model}= require('mongoose')

const ClassificationSchema= new Schema({
    group: {type:String, required:true},
    firstTeam:{type:String, required:true, default:" "},
    secondTeam:{type:String, required:true,default:" "},
    thirdTeam:{type:String, required:true,default:" "},
    fourthTeam:{type:String, required:true,default:" "},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)

module.exports = model('Classification', ClassificationSchema)