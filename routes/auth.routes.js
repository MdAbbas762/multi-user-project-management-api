const express = require('express');
const dataValidator = require('../middleware/dataValidatorMiddleware');
const { registerUser, loginUser } = require('../controllers/authController');
const { registerSchema,loginSchema } = require('../schemas/user.schema');

const router = express.Router();

router.post('/register', dataValidator({ body: registerSchema }), registerUser);
router.post('/login', dataValidator({ body: loginSchema }), loginUser);

module.exports = router;