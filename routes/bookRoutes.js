const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateRequest } = require('../middleware/validationMiddleware');
const { createBookSchema } = require('../validators/bookValidator');

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);
router.post('/', validateRequest(createBookSchema), bookController.createBook);

module.exports = router;