const { Router } = require('express');
const router = Router();
const activityController = require('../controllers/activityController');

router.get('/', activityController.documents);

module.exports = router;
