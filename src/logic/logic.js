// Codigo con la lógica del juego
const config = require('../config/config')
const game= require('../models/Game')
const classification= require('../models/Classification')
const betGame = require('../models/Bet-game')
const betClassification = require('../models/Bet-classification')


// Funcion que permite calcular en cada apuesta que tenga el idGame enviado, el puntaje ganado, ademas guarda el puntaje en earnedScore 
const calculatePointByGame = async (id) => {

// Actualizo el juego con parametro played en true 
await game.findByIdAndUpdate(id, {played:true},{new:true}) 
games= await game.find({_id:id})
betGames = await betGame.find({idGame:id})


betGames.forEach(async e=>{
// Analisis por puntaje y por localia
let earnedScore = [0,0,0,0]
if (games[0].localScore==e.localScore && games[0].visitScore==e.visitScore) {
  earnedScore[config.xPointByScore]=config.pointByScore
}
if (games[0].analogScore==e.analogScore) {
  earnedScore[config.xPointByAnalogScore]=config.pointByAnalogScore
}
// Si el juego es de cuartos, semi-final, tercer-cuarto, y final se gana puntaje por equipo acertado en la clasificacion de cada etapa
if (games[0].phase==config.phaseFourth || games[0].phase==config.phaseSemiFinals ||
  games[0].phase==config.phaseThirdFourth || games[0].phase==config.phaseFinal)
{
  if (e.betLocalTeam==games[0].localTeam) {
    earnedScore[config.xPointByLocalEqual]=config.pointByTeamClassificated
  }
  if (e.betVisitTeam==games[0].visitTeam) {
    earnedScore[config.xPointByVisitEqual]=config.pointByTeamClassificated}
}

await betGame.findOneAndUpdate( {_id:e._id }, {earnedScore}) 
console.log('puntos del juego '+e.idGame+' en la apuesta '+ e._id+ ' es: ' )
console.log('Puntos por resultado: ',earnedScore[config.xPointByScore])
console.log('Puntos por analog: ',earnedScore[config.xPointByAnalogScore])
console.log('Puntos por local coincidente: ',earnedScore[config.xPointByLocalEqual])
console.log('Puntos por visitante coincidente: ',earnedScore[config.xPointByVisitEqual])
})  
}

// Funcion que se encarga del calculo de los puntajes por claseficacion, se hace a partir de la comparacion del dcumento guardado o actualizado en classification con cdda uno de los documentos guardados en bet-classification, el parametro clave es el grupo, esta función aplica tambien para el grupo "final"

const calculatePointByClassification = async (group)=>{
const classifications= await classification.find({group})
const  betClassifications= await betClassification.find({group})

betClassifications.forEach(async e=>{
let earnedScore=[0,0,0,0]
if(group!="FINAL"){
 // Compara el primer equpo apostado del jugador con los de la clasificacion verdadera y se hace el analisis del orden
if (e.firstTeam==classifications[0].firstTeam){  // Se usa [0] ya que se tiene un array y este debe acceder a su primer y único elemento (es de esperarse que no hayan mas pues solo hay un documento de clasificado por grupo)
  earnedScore[config.xPointByFirst]=config.pointByClassificationOrder
} else {
  if (e.firstTeam==classifications[0].secondTeam){
    earnedScore[config.xPointByFirst]=config.pointByClassificatioNoOrder
  } 
}

// Compara el segundo equipo apostado del jugador con los de la clasificacion verdadera y se hace el analisis del orden
if (e.secondTeam==classifications[0].secondTeam){
  earnedScore[config.xPointBySecond]=config.pointByClassificationOrder
} else {
  if (e.secondTeam==classifications[0].firstTeam){
  earnedScore[config.xPointBySecond]=config.pointByClassificatioNoOrder
  }
}

}else // Aplica para el calculo de puntaje para la clasificación FINAL
{
  if (classifications[0].firstTeam == e.firstTeam) {
    earnedScore[config.xPointByFirst]=config.pointByFinalistFirstTeam
  }
  if (classifications[0].secondTeam == e.secondTeam) {
    earnedScore[config.xPointBySecond]=config.pointByFinalistSecondTeam
  }
  if (classifications[0].thirdTeam == e.thirdTeam) {
    earnedScore[config.xPointByThirdh]=config.pointByFinalistThirdTeam
  }
  if (classifications[0].fourthTeam == e.fourthTeam) {
    earnedScore[config.xPointByFourth]=config.pointByFinalistFourthTeam
  }
}
 // Guardado del puntaje ganado por el jugador en su documento de bet-classification
 await betClassification.findOneAndUpdate( {_id:e._id }, {earnedScore}) 
})
}







module.exports = {calculatePointByGame, calculatePointByClassification}