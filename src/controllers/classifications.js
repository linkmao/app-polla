const Classification = require('../models/Classification')
const { calculatePointByClassification } = require('../logic/logic')

const getClassification = async (req, res) => {
  const classifications = await Classification.find()
  res.status(200).json(classifications)
}

const getClassificationById = async (req, res) => {
  const classificationById = await Classification.findById(req.params.id)
  res.status(200).json(classificationById)
}

const addClassification = async (req, res) => {
  try {
    const { group } = req.body
    const newClassification = new Classification(req.body)
    await newClassification.save()
    await calculatePointByClassification(group)

    if (req.headers['content-type'] === 'application/json') {
      res.status(201).json({ "message": "Clasificación guardada" })
    } else {
      req.flash('mensajeOk', 'Clasificación guardada y puntos calculados')
      res.redirect('/admin/classifications')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al guardar: ' + error.message)
      res.redirect('/admin/classifications/add')
    }
  }
}

const updateClassification = async (req, res) => {
  try {
    switch (req.params.id) {
      case 'reset-classification':
        const classifications = await Classification.find().lean()
        for (const classification of classifications) {
          await Classification.findByIdAndUpdate(classification._id, { firstTeam: " ", secondTeam: " ", thirdTeam: " ", fourthTeam: " " }, { new: true })
        }
        if (req.headers['content-type'] === 'application/json') {
          res.status(200).json({ message: "Todas las clasificaciones fueron reseteadas" })
        } else {
          req.flash('mensajeOk', 'Clasificaciones reseteadas')
          res.redirect('/admin/classifications')
        }
        break
      default:
        const classificationUpdate = await Classification.findByIdAndUpdate(req.params.id, req.body, { new: true })
        const group = classificationUpdate.group

        // Siempre calculamos si viene del UI, o si forCalculate es true en JSON
        if (req.headers['content-type'] !== 'application/json' || req.body.forCalculate) {
          // console.log("Calculando puntos para el grupo: ", group)
          await calculatePointByClassification(group)
        }

        if (req.headers['content-type'] === 'application/json') {
          res.status(200).json(classificationUpdate)
        } else {
          req.flash('mensajeOk', 'Clasificación actualizada y puntos recalculados')
          res.redirect('/admin/classifications')
        }
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error: ' + error.message)
      res.redirect('/admin/classifications')
    }
  }
}

const deleteClassification = async (req, res) => {
  try {
    await Classification.findByIdAndDelete(req.params.id)
    if (req.headers['content-type'] === 'application/json') {
      res.status(200).send("Clasificado con id " + req.params.id + " borrado")
    } else {
      req.flash('mensajeOk', 'Clasificación eliminada correctamente')
      res.redirect('/admin/classifications')
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ "message": error.message })
    } else {
      req.flash('mensajeError', 'Error al eliminar: ' + error.message)
      res.redirect('/admin/classifications')
    }
  }
}

const deleteAllClassifications = async (req, res) => {
  await Classification.deleteMany()
  res.status(200).send('Todos las clasificaciones fueron borrados')
}

module.exports = { getClassification, addClassification, updateClassification, deleteClassification, getClassificationById, deleteAllClassifications }