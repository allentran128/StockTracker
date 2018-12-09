const route = require('express').Router();
const register = require('./register');

route.post('/', register);

module.exports = route;
