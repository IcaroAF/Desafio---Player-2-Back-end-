const express = require('express');
const companies = require('./controllers/companies');
const login = require('./controllers/login');

const routes = express();

//rota de cadastro de novas empresas;

routes.post('/empresas', companies.signUpUser);

//rota para login do usuário(empresa)
routes.post('/login', login.login);

module.exports = routes;