const {Schema, model}= require('mongoose')

const ClassificationSchema= new Schema({
    group: {type:String, required:true},
    firstTeam:{type:String, required:true, default:"NO-CLASSIFICATION"},
    secondTeam:{type:String, required:true,default:"NO-CLASSIFICATION"},
    thirdTeam:{type:String, required:true,default:"NO-CLASSIFICATION"},
    fourthTeam:{type:String, required:true,default:"NO-CLASSIFICATION"},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)

module.exports = model('Classification', ClassificationSchema)