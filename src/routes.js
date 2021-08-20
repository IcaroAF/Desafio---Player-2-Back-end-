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

//rota para listagem de todas as empresas
routes.get('/empresas', companies.companiesList);

//rota para edição de cadastro da empresa
routes.put('/perfil', companies.editCompany);

module.exports = routes;