const connection = require('../connection');
const bcrypt = require('bcrypt');
const axios = require('axios');

const signUpUser = async (req, res) => {
    const { cnpj, email, telefone, senha } = req.body;

    if (!cnpj) {
        return res.status(400).json("O campo CNPJ é obrigatório")
    }
    if (!email) {
        return res.status(400).json("O campo email é obrigatório")
    }
    if (!telefone) {
        return res.status(400).json("O campo telefone é obrigatório")
    }
    if (telefone.length < 10 || telefone.length > 11) {
        return res.status(400).json("O campo telefone necessita ter 10 ou 11 dígitos (somente números incluindo o DDD)");
    }
    if (!senha) {
        return res.status(400).json("O campo senha é obrigatório");
    }
    if (cnpj.length !== 14) {
        return res.status(400).json("O campo CNPJ necessita ter 14 dígitos (somente números)");
    }

    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        if (res.status(400)) {
            console.log("Esse CNPJ não está cadastrado velho")
        }

        const { cnpj: companyCNPJ, razao_social: razaoSocial, nome_fantasia: nomeFantasia, cep, municipio, uf: estado } = response.data;

        const checkCNPJQuery = 'SELECT * FROM empresas WHERE cnpj = ?';
        const ExistingCNPJ = await connection.query(checkCNPJQuery, [companyCNPJ]);


        if (ExistingCNPJ[0][0]) {
            return res.status(400).json("O CNPJ informado já está cadastrado no sistema.");
        }


        const encryptedPwd = await bcrypt.hash(senha, 10);

        const query = 'INSERT INTO empresas (cnpj, razao_social, nome_fantasia, cep, municipio, estado, telefone, email, senha) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const registeredCompany = await connection.query(query, [companyCNPJ, razaoSocial, nomeFantasia, cep, municipio, estado, telefone, email, encryptedPwd]);

        if (registeredCompany.TextRow === 0) {
            return res.status(400).json("Não foi possível cadastrar a empresa.");
        }

        return res.status(200).json("Empresa cadastrada com sucesso.");
    } catch (error) {
        if (error.config.url.includes("brasilapi")) {
            return res.json("Não existe empresa cadastrada com esse CNPJ");
        }
        return res.status(400).json(error.message);
    }

}

module.exports = {
    signUpUser,
};