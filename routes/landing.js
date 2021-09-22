const { Router } = require('express')
const router = Router()
const cardsController = require('../controllers/cardsController')

router.get('/', cardsController.getAll)

module.exports = router
