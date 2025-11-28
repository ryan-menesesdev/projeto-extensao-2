const { authUser, logout } = require('../controllers/authController')

const express = require('express');
const { validateLogin } = require('../validators/clientValidator');

const authRouter = express.Router();

authRouter.post('/login', validateLogin, authUser);
authRouter.get('/logout', logout);

module.exports = authRouter;