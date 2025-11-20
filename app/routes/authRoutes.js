const { authUser, logout, getCurrentUser } = require('../controllers/authController')

const express = require('express');
const isAuth = require('../middlewares/isAuth');
const authRouter = express.Router();

authRouter.post('/login', authUser);
authRouter.get('/me', isAuth, getCurrentUser);
authRouter.get('/logout', logout);

module.exports = authRouter;