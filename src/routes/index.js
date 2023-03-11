const { Router } = require('express')
const router = Router()
const { getGameAndBet, getBetClassificationByGroup, getGameAndBetByPhase, getGameAndBetFinal, getPointGameGroup, getPointGamePhase, getPointClassification, getPointGamePhantom, sumTotalPoint, totalPointByGameGroups, totalPointByGamePhases, totalPointByClassification, totalPointByClassificationFinal, totalPointPhaseOne, totalPointPhaseTwo, greatTotal, getAllGamersPoint, dataForGeneralPoint, dataForTableGame, dataForTableClass, getGameByGroup, getGameByPhase, getGameByPhaseFinal, getOneGame, getAllBetTheOneGame, getClassification, getBetClassificationAllUsers, getAllBetTheOneGamePhases, verifyGamesGroups, verifyClassGroups, verifyGamesPhases, verifyClassFinal, getAllGamersPointOptimizated, updateTotalPoint } = require('../controllers/index')
const config = require('../config/config')
const validar = require('../midleware/validaciones')

// Ejemplo para el envio de datos (borrar cuando sea necesario)
// router.get('/',(req,res)=> res.render('index',{message:"Radiohead Home", name:"Maolink"}) )
router.get('/', (req, res) => {
  const enableRegisterButton = config.renderButtonRegister
  const dataFlags = [{ enableRegisterButton }]
  res.render('index', { dataFlags })
}
)
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
  res.render('games')
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
  res.render('games', { dataGameAndBet, dataBetClassification, dataPoint })
})

router.get('/eighth', validar.isAuth, async (req, res) => {
  // Data para apuestas de octavos
  const dataBet = await getGameAndBetByPhase(config.phaseEighth, config.gamesEighth, req.user.id)
  // data para juegos de octavos
  const dataGame = await getGameByPhase(config.phaseEighth, config.gamesEighth)
  // Pequeño código para juntar la data de los game y apusta 
  const dataGameAndBet = []
  dataGame.forEach((g, i) => {
    dataGameAndBet.push({ dataGame: dataGame[i], dataBet: dataBet[i], renderTableByLocalAndVisit: false, renderBetRoundPhase: config.renderBetRoundPhases, renderButtonViewOtherBetPhases: config.renderViewOtherBetPhases })
  })
  const dataPointGames = await getPointGamePhase(config.phaseEighth, req.user.id)
  const total = sumTotalPoint([dataPointGames])
  const dataPoint = [{ dataPointGames, dataFlags: { renderEqualTeam: false, renderPhase: true, phase: "Octavos", total } }]
  res.render('games-by-phase', { dataGameAndBet, dataPoint })

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
  res.render('games-by-phase', { dataGameAndBet, dataPoint })
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
  res.render('games-by-phase', { dataGameAndBet, dataPoint })
})

router.get('/finals', validar.isAuth, async (req, res) => {
  // Data para apuestas de final
  const dataBet = await getGameAndBetFinal(config.phaseFinal, config.finalStruct, req.user.id)
  if (dataBet == null) {
    req.flash('mensajeError', 'Para realizar las apuestas de la fase FINAL, debes realizar primero todas las apuestas de la fase SEMI FINAL')
    res.redirect('/semi')
  }
  // data para juegos de final
  const dataGame = await getGameByPhaseFinal(config.phaseFinal, [63, 64])

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
  res.render('games-by-phase', { dataGameAndBet, dataBetClassification, dataPoint })
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
  res.render('admin/users')
})

router.get('/admin/pass-restore', validar.isAuth, validar.isAdmin, async (req, res) => {
  res.render('admin/pass-restore')
})

module.exports = router