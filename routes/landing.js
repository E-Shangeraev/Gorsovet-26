const { Router } = require('express')
const router = Router()
const landingController = require('../controllers/landingController')

router.get('/', landingController.render)

module.exports = router
