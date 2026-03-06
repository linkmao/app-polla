const Key = require('../models/Key')

const getKey = async (req, res) => {
  const Keys = await Key.find()
  res.json(Keys)
}

const getKeyById = async (req, res) => {
  const KeyById = await Key.findById(req.params.id)
  res.status(200).json(KeyById)
}

const addKey = async (req, res) => {
  try {
    const { keyNumber, keyCode } = req.body
    const newKey = new Key({ keyNumber, keyCode })
    await newKey.save()

    if (req.headers['content-type'] === 'application/json') {
      res.status(201).json({ "message": "Key creada" })
    } else {
      req.flash('mensajeOk', 'Llave creada correctamente')
      res.redirect('/admin/keys')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al crear la llave: ' + error.message)
      res.redirect('/admin/keys')
    }
  }
}

const updateKey = async (req, res) => {
  const keyUpdate = await Key.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(keyUpdate)
}

const deleteKey = async (req, res) => {
  try {
    await Key.findByIdAndDelete(req.params.id)
    if (req.headers['content-type'] === 'application/json') {
      res.status(200).send("Key con id " + req.params.id + "ha sido borrado")
    } else {
      req.flash('mensajeOk', 'Llave eliminada correctamente')
      res.redirect('/admin/keys')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al eliminar la llave: ' + error.message)
      res.redirect('/admin/keys')
    }
  }
}

const deleteAllKey = async (req, res) => {
  await Key.deleteMany()
  res.status(200).send('Todas las key fueron borrados')
}

module.exports = { getKey, getKeyById, addKey, updateKey, deleteKey, deleteAllKey }