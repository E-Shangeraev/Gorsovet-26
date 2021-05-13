const DocumentSession = require('../models/DocumentSession')
const DocumentReport = require('../models/DocumentReport')
const DocumentBase = require('../models/DocumentBase')
const path = require('path')

const getDocuments = async (req, res, model, title) => {
  const documents = await model
    .find({ year: req.query.y, month: req.query.m })
    .lean()
  const availableYears = await model.find().distinct('year').lean()
  const isCalendar =
    model !== DocumentBase && model !== DocumentReport ? true : false

  res.render('documents-folder', {
    title,
    isDocuments: true,
    documents,
    availableYears,
    m: req.query.m,
    y: req.query.y,
    isCalendar,
  })
}

exports.documents = async (req, res) => {
  const sessions = await DocumentSession.findOne()
    .sort({ year: -1, month: -1 })
    .lean()
  const reports = await DocumentReport.findOne()
    .sort({ year: -1, month: -1 })
    .lean()
  const base = await DocumentBase.findOne().sort({ year: -1, month: -1 }).lean()

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    sessions,
    reports,
    base,
  })
}

exports.sessions = (req, res) =>
  getDocuments(req, res, DocumentSession, 'Решения сессии')

exports.reports = (req, res) =>
  getDocuments(req, res, DocumentReport, 'Отчёты о деятельности')

exports.base = (req, res) =>
  getDocuments(req, res, DocumentBase, 'Нормативная правовая база')

exports.download = async (req, res) => {
  const zipFile = `${req.params.category}.zip`
  res.sendFile(
    path.join(__dirname, '../public/uploads/documents/archives', zipFile)
  )
}

exports.search = async (req, res) => {
  const category = req.params.category
  let collection

  switch (category) {
    case 'sessions':
      collection = DocumentSession
      break
    case 'reports':
      collection = DocumentReport
      break
    case 'base':
      collection = DocumentBase
      break
    default:
      break
  }

  if (req.body.request) {
    await collection
      .find(
        { $text: { $search: req.body.request } },
        { score: { $meta: 'textScore' } },
        (err, documents) => {
          res.send({ result: documents })
          return
        }
      )
      .sort({ score: { $meta: 'textScore' } })
  }
}
