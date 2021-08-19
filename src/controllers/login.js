const connection = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../secret');

const login = async (req, res) => {
    const { cnpj, senha } = req.body;

    if (!cnpj || !senha) {
        return res.status(400).json("Os campos cnpj e senha sao obrigatórios");
    }

    try {
        const checkCNPJQuery = 'SELECT * FROM empresas WHERE cnpj = ?';
        const queryData = await connection.query(checkCNPJQuery, [cnpj]);

        if (!queryData[0][0]) {
            return res.status(400).json("Empresa não encontrada.");
        }
        const company = queryData[0][0];

        const verifiedPwd = await bcrypt.compare(senha, company.senha);

        if (!verifiedPwd) {
            return res.status(400).json("Email e senha não conferem");
        }

        const token = jwt.sign({ cnpj: company.cnpj }, secret, { expiresIn: '1h' });

        const { senha: userPwd, ...companyData } = company;

        return res.status(200).json({
            empresa: companyData,
            token
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
};