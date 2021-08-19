const express = require('express');
const companies = require('./controllers/companies');
const login = require('./controllers/login');
const loginVerify = require('./middlewares/loginVerifier');

const routes = express();

//rota de cadastro de novas empresas;

routes.post('/empresas', companies.signUpUser);

//rota para login do usuário(empresa)
routes.post('/login', login.login);

routes.use(loginVerify);

module.exports = routes;