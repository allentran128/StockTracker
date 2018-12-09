const routes = require('express').Router();
const login = require('./login');
const register = require('./register');
const verify = require('./verify');
const stocks = require('./stocks');

routes.use('/login', login);
routes.use('/register', register);
routes.use('/verify', verify);
routes.use('/stock', stocks);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
