const express = require('express');
const router = express.Router();
const validar = require('../midleware/validaciones');

// Vista para el estado de diligenciamiento
router.get('/completion-status', validar.isAuth, validar.isAdmin, (req, res) => {
  res.render('admin/completion-status');
});

module.exports = router;
