const { Router } = require('express');
const router = Router();
const receptionController = require('../controllers/receptionController');

router.get('/', receptionController.reception);
router.get('/:id', receptionController.deputieSelected);
router.post('/appeal', receptionController.appeal);
router.post('/', receptionController.searchTips);
router.post('/search', receptionController.search);

module.exports = router;
