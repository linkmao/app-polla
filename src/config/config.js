// Contiene elementos generales de la configuracion del juego
module.exports = {
  secretword: "Palabra que solo yo conozco", // Este se usa para jwt (jsonwebtoken)
  tokenDuration: 60 * 24 * 60 * 60,  // Duracion en segundos (2 meses hora)
  pointByScore: 3,
  pointByAnalogScore: 2,
  pointByGroupClassification: 5,
  //pointByClassificatioNoOrder: 1,
  pointByTeamClassificated: 3,
  pointByFinalistFirstTeam: 10,
  pointByFinalistSecondTeam: 10,
  pointByFinalistThirdTeam: 10,
  pointByFinalistFourthTeam: 10,
  phaseInitial: 1,
  phaseSixteenth: 2,
  phaseEighth: 3,
  phaseFourth: 4,
  phaseSemiFinals: 5,
  // phaseThirdFourth:5,
  phaseFinal: 6, // esta fase tiene el juego de terceros y cuartos y el de final
  // La siguinte configuracion está asociado a la información necesaria para crear las apuestas de las etapas de cuartos de final, semifinal , y finales
  // La estructura para la conformación de los partidos de ocatavo de final en adelante se realiza con eesta configuración, cada array se compone de [juego1, juego2, juego3] donde juego3 se conforma con los ganadores de juego1 y juego2 respectivamente

  gamesSixteenth: [[74, 77, 89], [73, 75, 90], [76, 78, 91], [79, 80, 92], [83, 84, 93], [81, 82, 94], [86, 88, 95], [85, 87, 96]],
  gamesEighth: [[89, 90, 97], [93, 94, 98], [91, 92, 99], [95, 96, 100]],
  gamesFourth: [[97, 98, 101], [99, 100, 102]],
  gamesSemi: [[101, 102, 104]],
  // finalStruct contiene los juegos para armar la estructura de los dos juegos finales (tercero y cuarto y finales), si bien gamesSemi tiene la estructura para armar el juego final, debido a que se requiere otra logica para el juego de tercero y cuarto se implementa de estamanera, el orden de los datos correspondiente al numero de juego de los partidos necesrios es el siguiente
  // virtualNextGame es un juego que no se da (el siguiente a la final) y solo es para que sirva como almacenamiento para el equipo ganador de la final y de terceros y cuartos y así poder dar puntaje por ellos como en el resto esquema de clasificaciones
  //[Juego-semifinal-1, juego-semifinal-2, juego-tercero-y-cuarto, juego-final, virtualNexGame]
  gamePhantom: 105,
  finalStruct: [101, 102, 103, 104, 105],
  // Posicion de los diferents puntajes parciales en el array earnedScore del modelo betGames
  xPointByScore: 0,
  xPointByAnalogScore: 1,
  xPointByLocalEqual: 2,
  xPointByVisitEqual: 3,
  // Posicion de los diferents puntajes parciales en el array earnedScore del modelo classification
  xPointByFirst: 0,
  xPointBySecond: 1,
  xPointByThirdh: 2,
  xPointByFourth: 3,



  // Valores y configuraciones para el renderizado o no de algunos elementos segun la etapa del juego.
  /* Esta es una implementación que implica desplegar a producción cada que se necesite un cambio. Se buscará en 
  versiones posteriores hacer esta implementación ya sea via base de datos o por medio de variables de entorno, lo que permitiria en esos dos casos no desplegar con cdda cambio sino hacer el cambio correspondiente (base de datos o variable de entorno)*/
  renderButtonRegister: true, // renderiza el boton de registro
  renderBetRoundGroup: false, // permite que el usuario pueda usar la zona de apuestas para la ronda de grupos
  renderViewOtherBetGroup: true, // Activa el boton que permita ver las apuestas de los otros jugadores
  enableMenuRoundPhases: true, // Activa el Menu para acceder a los juegos de las fases
  renderBetRoundPhases: false, // Permite que el usuario puda usar la zonas de apuesas de la ronda por fases
  renderViewOtherBetPhases: true, // Activa el boton que permita ver las apuestas de los otros jugadores
  renderViewOtherBetClassFinal: true,// Muestra o no el boton para ver las clasificaciones FINAL
}