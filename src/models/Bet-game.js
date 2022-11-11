// Modelo de apuestas
const {Schema, model}= require('mongoose')
const betGameSchema = new Schema({
idGame:{type:String, required:true},
idUser:{type:String, required:true},
// phase:{type:Number, required:true}, LA FASE NO ES NECESARIA PUES LA TIENE EL MODELO GAME
betLocalTeam:{type:String,  required:true, default:"NO-BET"}, // Estos campos solo se usaran desde semifinales  
betVisitTeam:{type:String, required:true, default:"NO-BET"},
localScore:{type:Number, required:true},
visitScore:{type:Number, required:true},
analogScore:{type:String, required:true},
earnedScore:{type:Array, default:[0,0,0,0]},
created_at:{type:Date, default:Date.now}
},
{versionKey:false})

module.exports = model('BetGame', betGameSchema)