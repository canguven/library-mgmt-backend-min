const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRequest } = require('../middleware/validationMiddleware');
const { createUserSchema } = require('../validators/userValidator');
const { returnBookSchema } = require('../validators/bookValidator');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', validateRequest(createUserSchema), userController.createUser);
router.post('/:userId/borrow/:bookId', userController.borrowBook);
router.post('/:userId/return/:bookId', validateRequest(returnBookSchema), userController.returnBook);

module.exports = router;