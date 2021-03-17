const { Router } = require('express');
const comissionController = require('../controllers/comissionController');
const router = Router();

router.get('/', comissionController.documents);

module.exports = router;
