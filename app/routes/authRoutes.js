const { authUser, logout } = require('../controllers/authController')

const express = require('express');

const authRouter = express.Router();

authRouter.post('/login', authUser);
authRouter.get('/logout', logout);

module.exports = authRouter;