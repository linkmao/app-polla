const BetGame = require('../models/Bet-game')
const config = require('../config/config')
const {createGameThirdhAndFourth}= require('../controllers/index')

const getAllBets = async (req, res) => {
  const allBets = await BetGame.find()
  res.status(200).json(allBets)
}

const getMeBets = async (req, res) => {
  const bet = await BetGame.find({ idUser: req.user.id })
  res.status(200).json(bet)
}

const getBetGameById = async (req, res) => {
  const betGameById = await BetGame.findById(req.params.id)
  res.status(200).json(betGameById)
}

const getBetGameByIdUser = async (req, res) => {
  const betGamesByIdUser = await BetGame.find({ idUser: req.params.iduser })
  res.status(200).json(betGamesByIdUser)
}

const addMeBetGame = async (req, res) => {
  console.log(req.body.phase)
  if (req.body.phase == config.phaseInitial || req.body.phase == config.phaseEighth) {
    const { idGame, localScore, visitScore, analogScore, phase } = req.body
    const newMeBet = new BetGame({ idUser: req.user.id, idGame, localScore, visitScore, analogScore })
    await newMeBet.save()
    res.status(201).json(newMeBet)
  } else {
    const { idGame, localScore, visitScore, analogScore, localTeam, visitTeam } = req.body
    const newMeBet = new BetGame({ idUser: req.user.id, idGame, localScore, visitScore, analogScore, localTeam, visitTeam })
    await newMeBet.save()
    res.status(201).json(newMeBet)
  }
}

const addBetGame = async (req, res) => {
  if (req.body.phase == config.phaseInitial || req.body.phase == phaseEighth) {
    const { idGame, localScore, visitScore, analogScore } = req.body
    const newBet = new BetGame({ idUser: req.params.iduser, idGame, localScore, visitScore, analogScore })
    await newBet.save()
    res.status(201).json(newBet)
  } else {
    const { idGame, localScore, visitScore, analogScore, visitTeam, localTeam } = req.body
    const newBet = new BetGame({ idUser: req.params.iduser, idGame, localScore, visitScore, analogScore, visitTeam, localTeam })
    await newBet.save()
    res.status(201).json(newBet)
  }
}

// Permite la actualizacion de un aapuesta del usuario logueado
const updateMeBetGame = async (req, res) => {
  const gameMeBetUpdate = await BetGame.findOneAndUpdate({ idUser: req.user.id, _id: req.params.id, }, req.body, { new: true })
  res.redirect('/eighth')
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  // res.status(200).json(gameMeBetUpdate)
}

//Permite la actualizacion de una apuesta del usuario logueado y actualizar el equipo que va al siguiente juego (esta funcion solo tiene utilidad en el frontend)
const updateMeBetGameAndNextGame = async (req, res) => {
  // Actualiza apuesta del juego, pero no se puede mandar todo el body, por que se llevaria la info del equipo apostado a la otra ronda pero lo pondria en la apuesta actual, y es en la apuesta siguinete
  await BetGame.findOneAndUpdate({ idUser: req.user.id, _id: req.params.id, },{localScore:req.body.localScore, 
    analogScore:req.body.analogScore, visitScore:req.body.visitScore}, { new: true })
  
  // Guarda el equipo apostato para la siguinete ronda (juego de ganadors)
    await BetGame.findOneAndUpdate({ idUser: req.user.id, idGame: req.params.game }, { betLocalTeam: req.body.betLocalTeam, betVisitTeam: req.body.betVisitTeam })
  // Ademas del juego de ganadores creado (los elegidos por el usuario), si la pase es de semifinal se debe crear tambien el juego de perderores, para confromar así el juego de terceros y cuartos
  
  if (req.params.phase==config.phaseEighth) res.redirect(`/eighth#${req.params.id}`)
  if (req.params.phase==config.phaseFourth) res.redirect(`/fourth#${req.params.id}`)
  if(req.params.phase==config.phaseSemiFinals){
    await createGameThirdhAndFourth(req.user.id,config.finalStruct)
    res.redirect(`/semi#${req.params.id}`)
   }
  if (req.params.phase==config.phaseFinal) res.redirect(`/finals#${req.params.id}`)
}

const updateMeBetGameGroup = async (req, res) => {
  console.log("Actualizando grupo")
  const gameMeBetUpdate = await BetGame.findOneAndUpdate({ idUser: req.user.id, _id: req.params.id }, req.body, { new: true })
  const group = req.params.g
  res.redirect(`/groups/${group}#${req.params.id}`)
}

const updateBetGame = async (req, res) => {
  const gameBetUpdate = await BetGame.findOneAndUpdate({ _id: req.params.id, }, req.body, { new: true })
  // esa pequea configuraicion es para que mongo devuelva el objeto actualizado
  res.status(200).json(gameBetUpdate)
}

const deleteMeBetGame = async (req, res) => {
  const betMeErased = await BetGame.findOneAndDelete({ idUser: req.user.id, _id: req.params.id })
  // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.user.id + " ha sido borrado" )
  res.status(200).json(betMeErased)
}

const deleteBetGame = async (req, res) => {
  const betErased = await BetGame.findOneAndDelete({ _id: req.params.id })
  // res.status(200).send("Apuesta con id "+ req.params.id + " del jugador " + req.user.id + " ha sido borrado" )
  res.status(200).json(betErased)
}

const deleteAllMeBetGames = async (req, res) => {
  await BetGame.deleteMany({ idUser: req.user.id })
  res.status(200).send('Todos las apuestas del jugador ' + req.user.id + " fueron borrados")
}

const deleteAllBetGameByIdUser = async (req, res) => {
  await BetGame.deleteMany({ idUser: req.params.iduser })
  res.status(200).send('Todas las apueas del jugador' + req.params.iduser + " fueron borradas")
}

const deleteAllBetGames = async (req, res) => {
  await BetGame.deleteMany()
  res.status(200).send('Todos las apuestas de todos los jugadores fueron borradas')
}





module.exports = { getAllBets, getMeBets, getBetGameById, getBetGameByIdUser, addMeBetGame, addBetGame, updateMeBetGame, updateMeBetGameGroup, updateBetGame, deleteMeBetGame, deleteAllMeBetGames, deleteBetGame, deleteAllBetGameByIdUser, deleteAllBetGames, updateMeBetGameAndNextGame }