const express = require('express');
const companies = require('./controllers/companies');

const routes = express();

//rota de cadastro de novas empresas;

routes.post('/empresas', companies.signUpUser);

module.exports = routes;