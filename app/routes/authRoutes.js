const { authUser } = require('../controllers/authController')

const express = require('express');
const authRouter = express.Router();

authRouter.post('/login', authUser);

module.exports = authRouter;