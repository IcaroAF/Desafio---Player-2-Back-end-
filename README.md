# Desafio Back-end Player2

## API de cadastro de empresas.

# Conteúdos

-   Inicialização e dependências
-   Banco de Dados
-   Endpoints
    -   Requisição de cadastro de empresa
    -   Requisições de login no sistema
    -   Requisições de edição do cadsatro
    -   Requisição de remoção da empresa do banco de dados


##Inicialização e dependências

###Antes de iniciar o projeto, executar os seguintes comandos para instalar os modulos do NodeJS, instalar as dependências necessárias e executar o projeto

####Inicializar o npm

```JS
npm init -y
```

####Instalar as dependências
```JS
npm i express
npm i nodemon
npm i axios
npm i mysql2
npm i jsonwebtoken
npm i bcrypt 
```
####Inicializar o projeto

```JS
npm run dev
```


##Banco de dados;
Executar a query do arquivo `schema.sql` em qualquer modelador de banco de dados


## Endpoints

### Requisição de cadastro de empresa

#### `POST` `/empresas`

Recebe um JSON como entrada contendo o cnpj, email, telefone e senha da empresa (sendo todos os campos obrigatórios)

##### Exemplo de JSON

```JS
{
	"cnpj": "05081928000161",
	"email": "empresa@empresa",
	"telefone": "71999999999",
	"senha": "1234"
}
```
Havendo sucesso na requisição (CNPJ existente e todos os dados preenchidos corretamente) será exibida a seguinte mensagem:

```JS
"Empresa cadastrada com sucesso."
```

Na ausência de um dos dados ou o campo de cnpj não incluindo 14 dígitos ou o formato do telefone for incompátivel com os formatos existentes no Brasil haverão os seguintes retornos

```JS
"O campo CNPJ é obrigatório" 
"O campo email é obrigatório" 
"O campo telefone é obrigatório" 
"O campo senha é obrigatório" 
"O campo CNPJ necessita ter 14 dígitos (somente números)"
"O campo telefone necessita ter 10 ou 11 dígitos (somente números incluindo o DDD)"
```
Caso o CNPJ informado não esteja cadastrado no banco de dados da BrasilAPI será retornada a seguinte mensagem:

```JS
"Não existe empresa cadastrada com esse CNPJ"
```

### Requisição de login

#### `POST` `/login`

Recebebe um JSON como entrada contento o cnpj e a senha cadastrada
##### Exemplo de JSON

```JS
{
	"cnpj": "05081928000161",
	"senha": "1234"
}
```

Caso haja sucesso na autenticação a requisição retornará a seguinte resposta

```JS
{
  "empresa": {
    "cnpj": "05081928000161",
    "razao_social": "CONDOMINIO SHOPPING BEIRA MAR",
    "nome_fantasia": "CONDOMINIO SHOPPING BEIRA MAR",
    "cep": "41900400",
    "municipio": "SALVADOR",
    "estado": "BA",
    "telefone": "71999999999",
    "email": "empresa@empresa",
    "data_cadastro": "2021-08-19T20:50:12.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMDUwODE5MjgwMDAxNjEiLCJpYXQiOjE2Mjk0MTc5MTIsImV4cCI6MTYyOTQyMTUxMn0.5PSw3HFOEfaGqN_vmc0cBblYUwTSchIKFSO8BbiSpYs"
}
```
Onde o 'token' retornado será a chave para realizar as próximas requisições na API, com validade de 1 hora.

### Requisição de listagem de empresas cadastradas

#### `GET` `/empresas`

Nesta requisição o usuário autenticado solicitará a lista de todas as empresas cadastradas sendo retornado uma lista em JSON

### Para fazer a autenticação será necessário inserir o token na seção Auth do Insomnia selecionando Bearer Token (Será necessaria a utilização do token em todas as próximas requisições)
![image](https://user-images.githubusercontent.com/49756241/130161510-8031f384-89b2-4e95-b2f7-5853563920bc.png)


```JS
[
  {
    "cnpj": "05081928000161",
    "razao_social": "CONDOMINIO SHOPPING BEIRA MAR",
    "nome_fantasia": "CONDOMINIO SHOPPING BEIRA MAR",
    "cep": "41900400",
    "municipio": "SALVADOR",
    "estado": "BA",
    "telefone": "71999999999",
    "email": "empresa@empresa"
  },
  {
    "cnpj": "06279982000189",
    "razao_social": "SHOPPING SERVICE AGENCIAMENTO DE INGRESSOS LTDA.",
    "nome_fantasia": "SHOPPING SERVICE",
    "cep": "40070080",
    "municipio": "SALVADOR",
    "estado": "BA",
    "telefone": "71999999988",
    "email": "empresa2@empresa2"
  },
  {
    "cnpj": "13385026000147",
    "razao_social": "SHOPPING PISCINAS E SAUNAS LTDA",
    "nome_fantasia": "SHOPPING SAUNAS LTDA",
    "cep": "41940250",
    "municipio": "SALVADOR",
    "estado": "BA",
    "telefone": "7199999111",
    "email": "empresa3@empresa3"
  }
]
```
### Requisição de edição de cadastro

#### `PUT` `/perfil`

Nesta requisição o usuário logado poderá editar todos os campos (com exceção do cnpj e senha). O único campo obrigatório é a senha, necessária para validação da edição.

Exemplo:

```JS
{
	"telefone": "719999955566",
	"senha": "1234"
}
```
Para o campo de telefone ainda será realizada uma validação para verificar a quantidade de digitos colocados.

Ao fazer a requisição com os dados corretos o usuário receberá

```JS
"Cadastro atualizado com sucesso."
```

### Requisição de edição de cadastro

#### `DELETE` `/remover-empresa`

Nesta requisição o usuário logado somente executará o link da rota para excluir o próprio cadastro recebendo como retorno

```JS
"Empresa removida com sucesso"
```


