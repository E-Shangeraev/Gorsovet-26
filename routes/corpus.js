const { Router } = require('express');
const router = Router();
const corpusController = require('../controllers/corpusController');

router.get('/', corpusController.deputies);
router.get('/:id', corpusController.activities);
router.post('/', corpusController.searchTips);
router.post('/search', corpusController.search);

module.exports = router;
