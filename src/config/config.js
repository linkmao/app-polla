// Contiene elementos generales de la configuracion del juego
module.exports = {secretword:"Palabra que solo yo conozco",
tokenDuration:60*60,  // Duracion en segundos (1 hora)
pointByScore : 3,
pointByAnalogScore:2,
pointByClassificationOrder:3,
pointByClassificatioNoOrder:1,
pointByTeamClassificated:3,
pointByFinalistFirstTeam:10,
pointByFinalistSecondTeam:7,
pointByFinalistThirdTeam:5,
pointByFinalistFourthTeam:3,
phaseInitial:1,
phaseEighth:2,
phaseFourth:3,
phaseSemiFinals:4,
// phaseThirdFourth:5,
phaseFinal:5, // esta fase tiene el juego de terceros y cuartos y el de final
// La siguinte configuracion está asociado a la información necesaria para crear las apuestas de las etapas de cuartos de final, semifinal , y finales
// La estructura para la conformación de los partidos de ocatavo de final en adelante se realiza con eesta configuración, cada array se compone de [juego1, juego2, juego3] donde juego3 se conforma con los ganadores de juego1 y juego2 respectivamente
gamesEighth:[[49,50,57],[53,54,58],[51,52,59],[55,56,60]],
gamesFourth:[[57,58,61],[59,60,62]],
gamesSemi:[[61,62,64]],
// finalStruct contiene los juegos para alrmar la estructura de los dos juegos finales (tercero y cuarto y finales), si bien gamesSemi tiene la estructura para armar el juego final, debido a que se requiere otra logica para el juego de tercero y cuarto se implementa de estamanera, el orden de los datos correspondiente al numero de juego de los partidos necesrios es el siguiente
// virtualNextGame es un juego que no se da (el siguiente a la final) y solo es para que sirva como almacenamiento para el equipo ganador de la final y de terceros y cuartos y así poder dar puntaje por ellos como en el resto esquema de clasificaciones
//[Juego-semifinal-1, juego-semifinal-2, juego-tercero-y-cuarto, juego-final, virtualNexGame]
gamePhantom:65,
finalStruct:[61,62,63,64,65],
// Posicion de los diferents puntajes parciales en el array earnedScore del modelo betGames
xPointByScore:0,
xPointByAnalogScore:1,
xPointByLocalEqual:2,
xPointByVisitEqual:3,
// Posicion de los diferents puntajes parciales en el array earnedScore del modelo classification
xPointByFirst:0,
xPointBySecond:1,
xPointByThirdh:2,
xPointByFourth:3
}

