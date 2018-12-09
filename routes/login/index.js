const route = require('express').Router();
const login = require('./login');

route.post('/', login);

module.exports = route;
