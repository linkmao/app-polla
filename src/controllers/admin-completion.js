const { getUsers } = require('../controllers/users')
const { verifyGamesGroups, verifyGamesPhases, verifyClassGroups, verifyClassFinal } = require('../controllers/index')

// Endpoint para obtener el estado de diligenciamiento de cada usuario
const getUsersCompletionStatus = async (req, res) => {
  try {
    const users = await getUsersRaw();
    const results = [];
    for (const user of users) {
      if (user.role !== 'admin') {
        const missingGamesGroups = await verifyGamesGroups(user._id);
        const missingGamesPhases = await verifyGamesPhases(user._id);
        const missingClassGroups = await verifyClassGroups(user._id);
        const missingClassFinal = await verifyClassFinal(user._id);

        // Si solo falta un juego de fases, se considera OK (por el juego fantasma)
        let missingGamesPhasesCount = missingGamesPhases.length;
        if (missingGamesPhasesCount === 1) {
          missingGamesPhasesCount = 0;
        } else if (missingGamesPhasesCount > 1) {
          missingGamesPhasesCount = missingGamesPhasesCount - 1;
        }

        results.push({
          user,
          missingGamesGroups: missingGamesGroups.length,
          missingGamesPhases: missingGamesPhasesCount,
          missingClassGroups: missingClassGroups.length,
          missingClassFinal: missingClassFinal.length
        });
      }
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Helper para obtener todos los usuarios (sin respuesta HTTP)
const User = require('../models/User')
const getUsersRaw = async () => {
  return await User.find()
}

module.exports = { getUsersCompletionStatus }