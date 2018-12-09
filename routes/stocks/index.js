const route = require('express').Router();
const stocks = require('./stocks');
const single = require('./single');
const info = require('./info');

route.get('/', stocks);
route.get('/:name', single);
route.get('/info/:name', info);

module.exports = route;
