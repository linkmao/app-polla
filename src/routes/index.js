const { Router } = require('express')
const router = Router()
const { getGameAndBet, getBetClassificationByGroup, getGameAndBetByPhase, getGameAndBetFinal, getPointGameGroup, getPointGamePhase, getPointClassification, getPointGamePhantom, sumTotalPoint, totalPointByGameGroups, totalPointByGamePhases, totalPointByClassification, totalPointByClassificationFinal, totalPointPhaseOne, totalPointPhaseTwo, greatTotal, getAllGamersPoint, dataForGeneralPoint, dataForTableGame, dataForTableClass, getGameByGroup, getGameByPhase, getGameByPhaseFinal, getOneGame, getAllBetTheOneGame, getClassification, getBetClassificationAllUsers, getAllBetTheOneGamePhases, verifyGamesGroups, verifyClassGroups, verifyGamesPhases, verifyClassFinal, getAllGamersPointOptimizated, updateTotalPoint, getGamesByDate, getNextGames } = require('../controllers/index')
const config = require('../config/config')
const validar = require('../midleware/validaciones')
const adminConfig = require('../controllers/admin-config')

// Ejemplo para el envio de datos (borrar cuando sea necesario)
// router.get('/',(req,res)=> res.render('index',{message:"Radiohead Home", name:"Maolink"}) )
router.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/routegames')
  }
  const viewInitDateTournament = config.viewInitDateTournament
  const initDateTournament = config.initDateTournament
  res.render('landing', { layout: 'main', viewInitDateTournament, initDateTournament })
})

router.get('/login', (req, res) => {
  const enableRegisterButton = config.renderButtonRegister
  const renderGuestInfo = config.renderGuestInfo
  const viewInitDateTournament = config.viewInitDateTournament
  const initDateTournament = config.initDateTournament
  const dataFlags = [{ enableRegisterButton, renderGuestInfo, viewInitDateTournament, initDateTournament }]
  res.render('index', { dataFlags })
})

router.get('/rules-groups', (req, res) => {
  res.render('rules-groups')
})

router.get('/rules-phases', (req, res) => {
  res.render('rules-phases')
})

router.get('/about', (req, res) => res.render('about'))

router.get('/passrestore', (req, res) => res.render('user/pass-forget'))

// LLamado de utilidada que permite la actualización de todos los puntajes y guardado en la BD para optimiar consulta
router.get('/updatepoint', async (req, res) => {
  const data = await updateTotalPoint()
  res.status(200).json({ message: data })
})

router.get('/verifygamesgroups/:id', async (req, res) => {
  const data = await verifyGamesGroups(req.params.id)
  res.status(200).json({ message: data })
})

router.get('/verifygamesphases/:id', async (req, res) => {
  const data = await verifyGamesPhases(req.params.id)
  res.status(200).json({ message: data })
})

router.get('/verifyclassgroups/:id', async (req, res) => {
  const data = await verifyClassGroups(req.params.id)
  res.status(200).json({ message: data })
})

router.get('/verifyclassfinal/:id', async (req, res) => {
  const data = await verifyClassFinal(req.params.id)
  res.status(200).json({ message: data })
})

router.get('/signup', (req, res) => res.render('user/signup'))

router.get('/routegames', validar.isAuth, async (req, res) => {
  // console.log("estoy en routesgame")
  if (req.user.role == 'admin') {
    res.render('admin/panel')
  } else {
    // Obtener juegos del día y próximos con zona horaria local (Colombia)
    const today = new Date().toLocaleDateString('sv', { timeZone: 'America/Bogota' });
    // console.log("FECHA DE HOY (Local):", today)
    const gamesToday = await getGamesByDate(today, req.user.id);
    const gamesNext = await getNextGames(today, req.user.id);

    res.render('games', {
      showCountdown: true,
      gamesToday,
      gamesNext,
      hasGamesToday: gamesToday.length > 0,
      hasGamesNext: gamesNext.length > 0
    })
  }

})

router.get('/groups/:g', validar.isAuth, async (req, res) => {
  // Datos para pintar apuestas y clasificaciones  
  const dataBet = await getGameAndBet(req.params.g, req.user.id) //config.phaseInitial,

  const dataBetClassification = await getBetClassificationByGroup(req.params.g, req.user.id)

  // datos para pintar el game y los resultados reales
  const dataGame = await getGameByGroup(req.params.g)

  // Pequelo código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], dataFlagViewBet: config.renderBetRoundGroup, dataFlagViewButton: config.renderViewOtherBetGroup })
  })
  // Dattos para el tratamiento de los puntajes
  const dataPointGames = await getPointGameGroup(req.params.g, req.user.id)
  const dataPointClass = await getPointClassification(req.params.g, req.user.id)
  const total = sumTotalPoint([dataPointGames, dataPointClass])
  const dataPoint = [{ dataPointGames, dataPointClass, dataFlags: { renderGroup: true, renderClassification: true, total } }]

  let betGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b && b.localScore !== "") betGamesCount++;
  });

  let betClassCount = 0;
  if (dataBetClassification && dataBetClassification.length > 0) {
    if (dataBetClassification[0].betFirstTeam !== "Sin asignar") betClassCount = 1;
  }

  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => { if (g.localScore !== "-") realGamesCount++; });
  const realClassData = await getClassification(req.params.g);
  let realClassCount = 0;
  if (realClassData && realClassData[0].firstTeam !== "Sin clasificado") realClassCount = 1;

  const completionStatus = { totalGames: dataGame.length, betGames: betGamesCount, realGames: realGamesCount, totalClass: 1, betClass: betClassCount, realClass: realClassCount, renderClassCompletion: true, group: req.params.g };

  res.render('games', { dataGameAndBet, dataBetClassification, dataPoint, completionStatus })
})

router.get('/sixteenth', validar.isAuth, async (req, res) => {
  // Data para apuestas de dieciseisavos
  const dataBet = await getGameAndBetByPhase(config.phaseSixteenth, config.gamesSixteenth, req.user.id)
  // data para juegos de dieciseisavos
  const dataGame = await getGameByPhase(config.phaseSixteenth, config.gamesSixteenth)
  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: false, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases })
  })
  const dataPointGames = await getPointGamePhase(config.phaseSixteenth, req.user.id)
  const total = sumTotalPoint([dataPointGames])
  const dataPoint = [{ dataPointGames, dataFlags: { renderEqualTeam: false, renderPhase: true, phase: "Dieciseisavos", total } }]

  let betGamesCount = 0;
  let totalGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b) {
      if (b.localScore1 !== undefined) { totalGamesCount++; if (b.localScore1 !== "") betGamesCount++; }
      if (b.localScore2 !== undefined) { totalGamesCount++; if (b.localScore2 !== "") betGamesCount++; }
    }
  });
  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => {
    if (g.localScore1 !== undefined && g.localScore1 !== "-") realGamesCount++;
    if (g.localScore2 !== undefined && g.localScore2 !== "-") realGamesCount++;
  });
  const completionStatus = { totalGames: totalGamesCount, betGames: betGamesCount, realGames: realGamesCount, renderClassCompletion: false };

  res.render('games-by-phase', { dataGameAndBet, dataPoint, completionStatus })
})

router.get('/eighth', validar.isAuth, async (req, res) => {
  // Data para apuestas de cuartos
  const dataBet = await getGameAndBetByPhase(config.phaseEighth, config.gamesEighth, req.user.id)
  if (dataBet == null) {
    req.flash('mensajeError', 'Para realizar las apuestas de la fase de OCTAVOS DE FINAL, debes realizar primero todas las apuestas de la fase DIECISEISAVOS DE FINAL')
    res.redirect('/sixteenth')
  }
  // data para juegos de cuartos
  const dataGame = await getGameByPhase(config.phaseEighth, config.gamesEighth)
  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: true, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases, renderPointCoincidente: true })
  })
  const dataPointGames = await getPointGamePhase(config.phaseEighth, req.user.id)
  const total = sumTotalPoint([dataPointGames])
  const dataPoint = [{ dataPointGames, dataFlags: { renderEqualTeam: true, renderPhase: true, phase: "Octavos", total } }]

  let betGamesCount = 0;
  let totalGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b) {
      if (b.localScore1 !== undefined) { totalGamesCount++; if (b.localScore1 !== "") betGamesCount++; }
      if (b.localScore2 !== undefined) { totalGamesCount++; if (b.localScore2 !== "") betGamesCount++; }
    }
  });
  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => {
    if (g.localScore1 !== undefined && g.localScore1 !== "-") realGamesCount++;
    if (g.localScore2 !== undefined && g.localScore2 !== "-") realGamesCount++;
  });
  const completionStatus = { totalGames: totalGamesCount, betGames: betGamesCount, realGames: realGamesCount, renderClassCompletion: false };

  res.render('games-by-phase', { dataGameAndBet, dataPoint, completionStatus })
})


router.get('/fourth', validar.isAuth, async (req, res) => {
  // Data para apuestas de cuartos
  const dataBet = await getGameAndBetByPhase(config.phaseFourth, config.gamesFourth, req.user.id)
  if (dataBet == null) {
    req.flash('mensajeError', 'Para realizar las apuestas de la fase de CUARTOS DE FINAL, debes realizar primero todas las apuestas de la fase OCTAVOS DE FINAL')
    res.redirect('/eighth')
  }
  // data para juegos de cuartos
  const dataGame = await getGameByPhase(config.phaseFourth, config.gamesFourth)
  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: true, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases, renderPointCoincidente: true })
  })
  const dataPointGames = await getPointGamePhase(config.phaseFourth, req.user.id)
  const total = sumTotalPoint([dataPointGames])
  const dataPoint = [{ dataPointGames, dataFlags: { renderEqualTeam: true, renderPhase: true, phase: "Cuartos", total } }]

  let betGamesCount = 0;
  let totalGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b) {
      if (b.localScore1 !== undefined) { totalGamesCount++; if (b.localScore1 !== "") betGamesCount++; }
      if (b.localScore2 !== undefined) { totalGamesCount++; if (b.localScore2 !== "") betGamesCount++; }
    }
  });
  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => {
    if (g.localScore1 !== undefined && g.localScore1 !== "-") realGamesCount++;
    if (g.localScore2 !== undefined && g.localScore2 !== "-") realGamesCount++;
  });
  const completionStatus = { totalGames: totalGamesCount, betGames: betGamesCount, realGames: realGamesCount, renderClassCompletion: false };

  res.render('games-by-phase', { dataGameAndBet, dataPoint, completionStatus })
})

router.get('/semi', validar.isAuth, async (req, res) => {
  // Data para apuestas de semi
  const dataBet = await getGameAndBetByPhase(config.phaseSemiFinals, config.gamesSemi, req.user.id)
  if (dataBet == null) {
    req.flash('mensajeError', 'Para realizar las apuestas de la fase SEMI FINAL, debes realizar primero todas las apuestas de la fase CUARTOS DE FINAL')
    res.redirect('/fourth')
  }
  // data para juegos de semi
  const dataGame = await getGameByPhase(config.phaseSemiFinals, config.gamesSemi)
  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: true, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases, renderPointCoincidente: true })
  })
  const dataPointGames = await getPointGamePhase(config.phaseSemiFinals, req.user.id)
  const total = sumTotalPoint([dataPointGames])
  const dataPoint = [{ dataPointGames, dataFlags: { renderEqualTeam: true, renderPhase: true, phase: "Semifinal", total } }]

  let betGamesCount = 0;
  let totalGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b) {
      if (b.localScore1 !== undefined) { totalGamesCount++; if (b.localScore1 !== "") betGamesCount++; }
      if (b.localScore2 !== undefined) { totalGamesCount++; if (b.localScore2 !== "") betGamesCount++; }
    }
  });
  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => {
    if (g.localScore1 !== undefined && g.localScore1 !== "-") realGamesCount++;
    if (g.localScore2 !== undefined && g.localScore2 !== "-") realGamesCount++;
  });
  const completionStatus = { totalGames: totalGamesCount, betGames: betGamesCount, realGames: realGamesCount, renderClassCompletion: false };

  res.render('games-by-phase', { dataGameAndBet, dataPoint, completionStatus })
})

router.get('/finals', validar.isAuth, async (req, res) => {
  // Data para apuestas de final
  // console.log("ESPERANDO INFO")
  const dataBet = await getGameAndBetFinal(config.phaseFinal, config.finalStruct, req.user.id)
  // console.log("informacion obtenida", dataBet)
  if (dataBet == null) {
    req.flash('mensajeError', 'Para realizar las apuestas de la fase FINAL, debes realizar primero todas las apuestas de la fase SEMI FINAL')
    res.redirect('/semi')
  }
  // data para juegos de final
  const juegosFinal = [config.finalStruct[2], config.finalStruct[3]]
  const dataGame = await getGameByPhaseFinal(config.phaseFinal, juegosFinal)

  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: true, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases, renderPointCoincidente: true, rederPointVirtualGame: true })
  })
  const dataBetClassification = await getBetClassificationByGroup("FINAL", req.user.id)
  const dataPointGames = await getPointGamePhase(config.phaseFinal, req.user.id)
  const dataPointClass = await getPointClassification("FINAL", req.user.id)
  const dataPointGamePhantom = await getPointGamePhantom(config.gamePhantom, req.user.id)
  const total = sumTotalPoint([dataPointGames, dataPointClass, dataPointGamePhantom])
  const dataPoint = [{ dataPointGames, dataPointClass, dataPointGamePhantom, dataFlags: { renderClassification: true, renderEqualTeam: true, renderGamePhantom: true, renderPhase: true, phase: "Final", total } }]

  let betGamesCount = 0;
  let totalGamesCount = 0;
  if (dataBet) dataBet.forEach(b => {
    if (b) {
      if (b.localScore1 !== undefined) { totalGamesCount++; if (b.localScore1 !== "") betGamesCount++; }
      if (b.localScore2 !== undefined) { totalGamesCount++; if (b.localScore2 !== "") betGamesCount++; }
    }
  });

  let betClassCount = 0;
  if (dataBetClassification && dataBetClassification.length > 0) {
    if (dataBetClassification[0].betFirstTeam !== "Sin asignar") betClassCount = 1;
  }

  let realGamesCount = 0;
  if (dataGame) dataGame.forEach(g => {
    if (g.localScore1 !== undefined && g.localScore1 !== "-") realGamesCount++;
    if (g.localScore2 !== undefined && g.localScore2 !== "-") realGamesCount++;
  });
  const realClassData = await getClassification("FINAL");
  let realClassCount = 0;
  if (realClassData && realClassData[0].firstTeam !== "Sin clasificado") realClassCount = 1;

  const completionStatus = { totalGames: totalGamesCount, betGames: betGamesCount, realGames: realGamesCount, totalClass: 1, betClass: betClassCount, realClass: realClassCount, renderClassCompletion: true };

  res.render('games-by-phase', { dataGameAndBet, dataBetClassification, dataPoint, completionStatus })
})

router.get('/detailpoints', validar.isAuth, async (req, res) => {
  const dataPoint = await dataForGeneralPoint(req.user.id) // INFO PARA LA PUNTACION GENERAL  
  const dataTableGame = await dataForTableGame(req.user.id) // INFO PARA LA TABLA DE PUNTAJE POR JUEGOS
  const dataTableClass = await dataForTableClass(req.user.id) //INFO PARA LA TABLA DE CLASIFICACIONES
  res.render('detail-points', { dataPoint, dataTableGame, dataTableClass })
})

router.get('/detailpointsgamers', validar.isAuth, async (req, res) => {
  data = await getAllGamersPoint()
  res.render('detail-points-gamers', { data })
})

router.get('/detailpointsgamersoptimizated', async (req, res) => {
  data = await getAllGamersPointOptimizated()
  res.render('detail-points-gamers', { data })
})

// Ruta para mostrar el detalle de una apuesta, de un solo juego,
router.get('/detailpointbygame/:idgame', validar.isAuth, async (req, res) => {
  const dataGame = await getOneGame(req.params.idgame)
  const dataBet = await getAllBetTheOneGame(req.params.idgame)
  res.render('detail-point-by-game', { dataGame, dataBet })
})

router.get('/detailpointbygamephases/:idgame', validar.isAuth, async (req, res) => {
  const dataGame = await getOneGame(req.params.idgame)
  const dataBet = await getAllBetTheOneGamePhases(req.params.idgame)
  res.render('detail-point-by-game-phases', { dataGame, dataBet })
})

router.get('/detailpointbyclassification/:group', validar.isAuth, async (req, res) => {
  const dataClassification = await getClassification(req.params.group)
  const dataBetClassification = await getBetClassificationAllUsers(req.params.group)
  const dataFlag = []
  if (req.params.group == 'FINAL') {
    dataFlag.push({ renderFinal: true })
  } else {
    dataFlag.push({ renderFinal: false })
  }

  res.render('detail-point-by-classification', { dataClassification, dataBetClassification, dataFlag })
})

router.get('/profile', validar.isAuth, async (req, res) => {
  res.render('user/profile')
})

router.get('/password', validar.isAuth, async (req, res) => {
  res.render('user/password')
})

router.get('/admin/users', validar.isAuth, validar.isAdmin, async (req, res) => {
  const users = await User.find().lean().sort({ name: 1 })
  res.render('admin/users', { users })
})

router.get('/admin/users/edit/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  const editUser = await User.findById(req.params.id).lean()
  res.render('admin/edit-user', { editUser })
})

router.post('/admin/users/edit/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  const { name, lastName, phone, pass } = req.body
  let updateData = { name, lastName, phone }
  if (pass && pass.trim() !== '') {
    updateData.pass = await User.encryptPass(pass)
  }
  await User.findByIdAndUpdate(req.params.id, updateData)
  req.flash('mensajeOk', 'Usuario actualizado correctamente')
  res.redirect('/admin/users')
})

router.post('/admin/users/delete/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  req.flash('mensajeOk', 'Usuario eliminado exitosamente')
  res.redirect('/admin/users')
})

router.get('/admin/pass-restore', validar.isAuth, validar.isAdmin, async (req, res) => {
  res.render('admin/pass-restore')
})

const Team = require('../models/Team')
const Game = require('../models/Game') // Added this line for the new routes
const User = require('../models/User')

router.get('/admin/teams', validar.isAuth, validar.isAdmin, async (req, res) => {
  const teams = await Team.find().lean().sort({ name: 1 })
  res.render('admin/manage-teams', { teams })
})

router.get('/admin/teams/edit/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  const team = await Team.findById(req.params.id).lean()
  res.render('admin/edit-team', { team })
})

router.get('/admin/games', validar.isAuth, validar.isAdmin, async (req, res) => {
  const gamesRaw = await Game.find().lean().sort({ gameNumber: 1 })
  const teams = await Team.find().lean()
  const games = gamesRaw.map(g => {
    const localTeam = teams.find(t => t._id == g.localTeam)
    const visitTeam = teams.find(t => t._id == g.visitTeam)
    return {
      ...g,
      localTeamName: localTeam ? localTeam.name : 'Sin asignar',
      visitTeamName: visitTeam ? visitTeam.name : 'Sin asignar',
      localFlag: localTeam ? localTeam.flag : 'no-flag.png',
      visitFlag: visitTeam ? visitTeam.flag : 'no-flag.png'
    }
  })
  res.render('admin/manage-games', { games })
})

router.get('/admin/games/edit/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  const game = await Game.findById(req.params.id).lean()
  const teams = await Team.find().lean().sort({ name: 1 })
  res.render('admin/edit-game', { game, teams })
})

router.get('/admin/teams/add', validar.isAuth, validar.isAdmin, (req, res) => {
  res.render('admin/add-team')
})

router.get('/admin/games/add', validar.isAuth, validar.isAdmin, async (req, res) => {
  const teams = await Team.find().lean().sort({ name: 1 })
  res.render('admin/add-game', { teams })
})

const Key = require('../models/Key') // Ensure Key model is imported
const Classification = require('../models/Classification')

router.get('/admin/keys', validar.isAuth, validar.isAdmin, async (req, res) => {
  const keys = await Key.find().lean().sort({ keyNumber: 1 })
  res.render('admin/manage-keys', { keys })
})

router.get('/admin/classifications', validar.isAuth, validar.isAdmin, async (req, res) => {
  const classifications = await Classification.find().lean().sort({ group: 1 })
  const teams = await Team.find().lean()

  // Create a map for quick lookup: { id: name }
  const teamMap = {}
  teams.forEach(t => {
    teamMap[t._id.toString()] = t.name
  })

  // Manually attach readable names
  const enhancedClassifications = classifications.map(c => ({
    ...c,
    firstTeamName: teamMap[c.firstTeam] || c.firstTeam,
    secondTeamName: teamMap[c.secondTeam] || c.secondTeam,
    thirdTeamName: teamMap[c.thirdTeam] || c.thirdTeam,
    fourthTeamName: teamMap[c.fourthTeam] || c.fourthTeam
  }))

  res.render('admin/manage-classifications', { classifications: enhancedClassifications })
})

router.get('/admin/classifications/add', validar.isAuth, validar.isAdmin, async (req, res) => {
  const teams = await Team.find().lean().sort({ name: 1 })
  let groups = await Team.distinct('group')
  if (!groups.includes('FINAL')) groups.push('FINAL')
  res.render('admin/add-classification', { teams, groups })
})

router.get('/admin/classifications/edit/:id', validar.isAuth, validar.isAdmin, async (req, res) => {
  const classification = await Classification.findById(req.params.id).lean()
  const teams = await Team.find().lean().sort({ name: 1 })
  let groups = await Team.distinct('group')
  if (!groups.includes('FINAL')) groups.push('FINAL')
  res.render('admin/edit-classification', { classification, teams, groups })
})

router.get('/admin/config', validar.isAuth, validar.isAdmin, adminConfig.getConfig)
router.post('/admin/config', validar.isAuth, validar.isAdmin, adminConfig.updateConfig)

module.exports = router