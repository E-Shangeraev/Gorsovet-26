const { Router } = require('express');
const router = Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);
router.get('/calendar', mainController.calendar);
router.post('/question', mainController.question);
router.post('/main', mainController.searchTips);
router.post('/main/search', mainController.search);

module.exports = router;
