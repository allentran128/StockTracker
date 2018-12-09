const route = require('express').Router();
const verify = require('./verify');

route.get('/', verify);

module.exports = route;
