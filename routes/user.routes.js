const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const dataValidator = require('../middleware/dataValidatorMiddleware');
const deleteUser  = require('../controllers/userController');
const { deleteUserSchema } = require('../schemas/user.schema');

const router = express.Router();

router.delete('/:userId', authMiddleware, dataValidator({ params: deleteUserSchema }), deleteUser);

module.exports = router;