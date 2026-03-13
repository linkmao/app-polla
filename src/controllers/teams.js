const Team = require('../models/Team')

const getTeam = async (req, res) => {
  const Teams = await Team.find()
  res.status(200).json(Teams)
}

const getTeamById = async (req, res) => {
  const TeamById = await Team.findById(req.params.id)
  res.status(200).json(TeamById)
}

const addTeam = async (req, res) => {
  try {
    const { name, group, tag } = req.body
    let flag = req.body.flag

    // Si hay un archivo subido, usamos su nombre generado por multer
    if (req.file) {
      flag = req.file.filename
    }

    const newTeam = new Team({ name, group, tag, flag })
    await newTeam.save()
    if (req.headers['content-type'] === 'application/json') {
      res.status(201).json({ "message": "Equipo guardado" })
    } else {
      req.flash('mensajeOk', 'Equipo guardado correctamente')
      res.redirect('/admin/teams/add')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al guardar el equipo: ' + error.message)
      res.redirect('/admin/teams/add')
    }
  }
}

const updateTeam = async (req, res) => {
  try {
    const updateData = { ...req.body }

    // Si se subió una nueva imagen, actualizamos el campo flag
    if (req.file) {
      updateData.flag = req.file.filename
    }

    const teamUpdate = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (req.headers['content-type'] === 'application/json') {
      res.status(200).json(teamUpdate)
    } else {
      req.flash('mensajeOk', 'Equipo actualizado correctamente')
      res.redirect('/admin/teams')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al actualizar el equipo: ' + error.message)
      res.redirect('/admin/teams')
    }
  }
}

const deleteTeam = async (req, res) => {
  await Team.findByIdAndDelete(req.params.id)
  res.status(200).send("Elemento " + req.params.id + " borrado")
}

const deleteAllTeam = async (req, res) => {
  await Team.deleteMany()
  res.status(200).send('Todos los equipos fueron borrados')
}

module.exports = { getTeam, addTeam, updateTeam, deleteTeam, getTeamById, deleteAllTeam }