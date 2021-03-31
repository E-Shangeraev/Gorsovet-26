const { Router } = require('express');
const router = Router();
const activityController = require('../controllers/activityController');

router.get('/', activityController.documents);
router.get('/work', activityController.work);
router.get('/hearing', activityController.hearing);
router.get('/sessions', activityController.sessions);

module.exports = router;
