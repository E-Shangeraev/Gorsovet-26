const ActivityWork = require('../models/ActivityWork')
const ActivityHearing = require('../models/ActivityHearing')
const ActivitySession = require('../models/ActivitySession')

const getDocuments = async (req, res, model, title) => {
  const documents = await model
    .find({ year: req.query.y, month: req.query.m })
    .lean()
  const availableYears = await model.find().distinct('year').lean()

  res.render('documents-folder', {
    title,
    isActivity: true,
    documents,
    availableYears,
    m: req.query.m,
    y: req.query.y,
    isCalendar: true,
  })
}

exports.documents = async (req, res) => {
  const work = await ActivityWork.findOne().sort({ year: -1, month: -1 }).lean()
  const hearing = await ActivityHearing.findOne()
    .sort({ year: -1, month: -1 })
    .lean()
  const sessions = await ActivitySession.findOne()
    .sort({ year: -1, month: -1 })
    .lean()

  res.render('activity', {
    title: 'Деятельность совета',
    isActivity: true,
    work,
    hearing,
    sessions,
  })
}

exports.work = async (req, res) =>
  getDocuments(req, res, ActivityWork, 'Работа комиссий')

exports.hearing = async (req, res) =>
  getDocuments(req, res, ActivityHearing, 'Публичные слушания')

exports.sessions = async (req, res) =>
  getDocuments(req, res, ActivitySession, 'Сессии')
