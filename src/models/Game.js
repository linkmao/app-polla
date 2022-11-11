const {Schema, model}= require('mongoose')

const GameSchema= new Schema({
    gameNumber:{type:Number,required:true},
    group:{type:String, required:true, default:"GENERIC GROUP"},
    phase:{type:Number, required:true},
    localTeam: {type:String, required:true, default:"GENERIC LOCAL TEAM"},
    visitTeam:{type:String, required:true, default:"GENERIC VISIT TEAM"},
    localScore:{type:Number, default:-1},
    visitScore:{type:Number, default:-1},
    analogScore:{type:String, default:"-1"}, // Despues que un juego se actualiza, esta propiedad será L, E, V 
    played:{type:Boolean, default:false},
    created_at:{type:Date, default:Date.now}
}, 
{versionKey:false})  // elimina __v el cual es un versionado por defecto de mongoose (por el momento no funciona)

// por defecto un resultado en -1 significa que el juego no se ha realizado, además se tiene tambien la propieddd played para ese fin

module.exports = model('Game', GameSchema)