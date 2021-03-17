const { Router } = require('express');
const documentsController = require('../controllers/documentsController');
const router = Router();

router.get('/', documentsController.documents);
router.get('/download', documentsController.download);
router.post('/', documentsController.autoFillbar);
router.post('/search', documentsController.search);

module.exports = router;
