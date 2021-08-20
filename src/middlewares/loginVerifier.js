const jwt = require('jsonwebtoken');
const secret = require('../secret');
const connection = require('../connection');

const loginVerify = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json("Token não informado");
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { cnpj } = jwt.verify(token, secret);

        const query = 'SELECT * FROM empresas WHERE cnpj = ?';
        const companyData = await connection.query(query, [cnpj]);

        if (!companyData) {
            return res.status(404).json("A empresa não foi encontrada.");
        }

        const { senha, ...company } = companyData[0][0];

        req.company = company;
        next();
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = loginVerify;