const express = require('express');
const userController = require('../controllers/user');

const authRouter = express.Router();

authRouter.get('/signup', userController.showSignup);
authRouter.post('/signup', userController.signup);

authRouter.get('/login', userController.showLogin);
authRouter.post('/login', userController.login);

authRouter.get('/logout', userController.logout);

module.exports = authRouter;
