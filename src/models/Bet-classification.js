const {Schema, model}= require('mongoose')

const betClassificationSchema = new Schema({
idUser:{type:String, required:true},
// idClassification:{type:String, required:true, default:" "},
group:{type:String, required:true}, //Para la fase de grupos, group será A, B, C etc, para los cuatro finalistas, group será FINAL
firstTeam:{type:String,required:true, default:"NO-BET"},
secondTeam:{type:String,required:true,default:"NO-BET"},
thirdTeam:{type:String,required:true,default:"NO-BET"},
fourthTeam:{type:String,required:true,default:"NO-BET"},
earnedScore:{type:Array, default:[0,0,0,0]},
created_at:{type:Date, default:Date.now}
},
{versionKey:false})

module.exports = model('BetClassification', betClassificationSchema)