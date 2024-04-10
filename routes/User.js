const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/User');

// SignUp API 
Router.post('/register', UserController.RegisterUser);

// Log In API


// Get Users
Router.get('/', UserController.GetUsers);


module.exports = Router;