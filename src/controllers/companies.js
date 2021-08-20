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

        const { cnpj: companyCNPJ, razao_social: razaoSocial, nome_fantasia: nomeFantasia, cep, municipio, uf: estado } = response.data;

        const checkCNPJQuery = 'SELECT * FROM empresas WHERE cnpj = ?';
        const ExistingCNPJ = await connection.query(checkCNPJQuery, [companyCNPJ]);


        if (ExistingCNPJ[0][0]) {
            return res.status(400).json("O CNPJ informado já está cadastrado no sistema.");
        }


        const encryptedPwd = await bcrypt.hash(senha, 10);

        const query = 'INSERT INTO empresas (cnpj, razao_social, nome_fantasia, cep, municipio, estado, telefone, email, senha) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const registeredCompany = await connection.query(query, [companyCNPJ, razaoSocial, nomeFantasia, cep, municipio, estado, telefone, email, encryptedPwd]);

        if (!registeredCompany[0][0]) {
            return res.status(400).json("Não foi possível cadastrar a empresa.");
        }

        return res.status(200).json("Empresa cadastrada com sucesso.");
    } catch (error) {
        if (error.config.url.includes("brasilapi")) {
            return res.status(400).json("Não existe empresa cadastrada com esse CNPJ");
        }
        return res.status(400).json(error.message);
    }

}

const companiesList = async (req, res) => {
    try {
        const companiesQuery = 'SELECT cnpj, razao_social, nome_fantasia, cep, municipio, estado, telefone, email FROM empresas';
        const companiesProfiles = await connection.query(companiesQuery);

        return res.status(200).json(companiesProfiles[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const editCompany = async (req, res) => {
    let { razao_social, nome_fantasia, cep, municipio, estado, telefone, email, senha } = req.body;
    const { company } = req;

    if (!razao_social) {
        razao_social = company.razao_social
    }
    if (!nome_fantasia) {
        nome_fantasia = company.nome_fantasia
    }
    if (!cep) {
        cep = company.cep
    }
    if (!municipio) {
        municipio = company.municipio
    }
    if (!estado) {
        estado = company.estado
    }
    if (!telefone) {
        telefone = company.telefone
    }
    if (!email) {
        email = company.email
    }
    if (!senha) {
        return res.status(400).json("O campo senha é obrigatório");
    }

    try {

        const checkCNPJQuery = 'SELECT * FROM empresas WHERE cnpj = ?';
        const queryData = await connection.query(checkCNPJQuery, [company.cnpj]);

        const currentPwd = queryData[0][0].senha

        const verifiedPwd = await bcrypt.compare(senha, currentPwd);

        if (!verifiedPwd) {
            return res.status(400).json("Senha Incorreta");
        }

        const updateCompany = 'UPDATE empresas SET razao_social = ?, nome_fantasia =? , cep = ?, municipio = ?, estado = ?, telefone = ? , email = ?, senha = ? WHERE cnpj = ?';

        const updatedCompany = await connection.query(updateCompany, [razao_social, nome_fantasia, cep, municipio, estado, telefone, email, currentPwd, company.cnpj]);


        if (updatedCompany[0].affectedRows === 0) {
            return res.status(400).json("Não foi possível atualizar o cadastro da empresa.");
        }

        return res.status(200).json("Cadastro atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const deleteCompany = async (req, res) => {
    const { company } = req;

    try {

        await connection.query('DELETE FROM empresas WHERE cnpj = ?', [company.cnpj]);

        return res.status(200).json("Empresa removida com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    signUpUser,
    companiesList,
    editCompany,
    deleteCompany
};