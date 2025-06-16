# Clube de Benefícios - API NestJS

Este projeto é uma API RESTful desenvolvida com **NestJS** para gerenciar clientes, produtos e compras, com autenticação JWT. O banco de dados utilizado é **PostgreSQL** e o projeto está pronto para rodar em ambiente local com **Docker**.

---

> **Nota sobre nomenclatura e organização:**  
> Tenho costume de escrever código em inglês, por isso utilizei os termos `client` para cliente, `product` para produto e `purchase` para compra em todo o código, entidades e variáveis.  
> As tabelas do banco seguem um padrão de organização e semântica, sempre começando com o prefixo `t_` e usando apenas letras minúsculas (ex: `t_client`, `t_product`, `t_purchase`).  
> No código, todas as variáveis e nomes de classes seguem o padrão camelCase.  
> As mensagens de retorno e as rotas da API permanecem em português para melhor aderência ao contexto do projeto.
---

## O que foi feito neste projeto

Este projeto foi desenvolvido para atender ao seguinte desafio:

**Desafio para Desenvolvedores**

Cenário: Você foi contratado para desenvolver a API de um clube de benefícios que oferece produtos para clientes. A API deve permitir o cadastro de clientes, produtos e a compra de produtos pelos clientes.

**Questões:**

1. **Criação de API REST**
   - Implemente uma API REST utilizando Node.js com seu framework favorito que
      tenha os seguintes endpoints:
     - `POST /clientes` - Cadastrar um novo cliente (nome, email, senha)
     - `POST /produtos` - Cadastrar um novo produto (nome, descrição, preço)
     - `POST /compras` - Registrar uma compra (cliente_id, produto_id)
     - `GET /clientes` - Recuperar todos os clientes
     - `GET /produtos` - Recuperar todos os produtos
     - `GET /compras` - Recuperar todas as compras
     - `GET /compras?cliente_id=123` - Filtrar compras por cliente
     - `GET /produtos?preco_min=50&preco_max=200` - Filtrar produtos por faixa de preço

   - **Exemplo de estrutura básica do código:**  
     O projeto está organizado em módulos (`clients`, `products`, `purchases`, `auth`), cada um com seus controllers, services, entidades e DTOs, seguindo boas práticas do NestJS.

## Qual seria a estrutura básica do código para implementar essa API? Apresente um exemplo de código.

2. **Banco de Dados**

      **a) Que banco de dados você recomendaria para essa aplicação? Justifique sua escolha.**

      PostgreSQL, por ser robusto, relacional, open source e amplamente utilizado em aplicações empresariais.

      **b) Escreva um modelo de esquema usando Sequelize ou Mongoose para representar as entidades Cliente, Produto e Compra.**  

      Como na nossa conversa foi dito que poderia utilizar qualquer outro ORM utilizei o  TypeORM para mapear as entidades `Client`, `Product` e `Purchase`.

3. **Autenticação e Segurança**

      **a) Como você implementaria autenticação para os clientes? Utilize JWT em seu exemplo.** 

      Implementei o JWT para a rota de registro de COMPRAS e LOGIN do CLiente, para cadastrar uma compra é necessário autenticar como CLIENT e utilizar seu token.

      **b) Como garantiria a segurança das senhas no banco de dados? Apresente um trecho de código ilustrando sua resposta.** 
      
      As senhas dos clientes são armazenadas de forma segura utilizando hash com bcrypt.  
     Exemplo:
     ```typescript
     const hashedPassword = await bcrypt.hash(password, 10);
     ```

4. **Boas Práticas e Testes**

      **a) Quais são as boas práticas para organizar o código de uma API Node.js?** 
      
      O código está modularizado por domínio, com uso de DTOs, services, controllers e entidades, além de validação de dados e uso de guards para autenticação.


      **b) Como você implementaria testes para os endpoints da API? Forneça um exemplo usando Jest ou Supertest.** 
      
      O projeto já possui testes automatizados implementados utilizando **Jest** e **Supertest**. Os testes de integração cobrem os principais endpoints de clientes, produtos e compras, garantindo que as rotas funcionem corretamente e que as regras de negócio sejam respeitadas. 

      Os arquivos de teste estão localizados na pasta [`test`](./test), por exemplo:
      - `test/clients.e2e-spec.ts`
      - `test/products.e2e-spec.ts`
      - `test/purchases.e2e-spec.ts`

      Esses testes simulam requisições HTTP reais à API, validando tanto respostas de sucesso quanto de erro, e podem ser executados com o comando:

      ```
      npm run test:e2e
      ```

      Isso garante maior confiabilidade e facilita a manutenção do sistema.

5. **Desempenho e Escalabilidade**

      **a) Quais estratégias você utilizaria para melhorar o desempenho da API?** 
      
      Uso de banco relacional eficiente, modularização do código, uso de cache (quando necessário), e possibilidade de deploy em containers para facilitar o escalonamento horizontal.

      **b) Como garantiria que a API possa escalar para atender um grande número de requisições?** 
      
      A API pode ser escalada utilizando múltiplas instâncias (Docker/Kubernetes).

Todas as perguntas do desafio foram respondidas e implementadas na estrutura do projeto, conforme detalhado abaixo.

---

## Estrutura do Projeto

```
rewards-club
├── src
│   ├── app.module.ts              # Módulo raiz da aplicação
│   ├── main.ts                    # Ponto de entrada da aplicação
│   ├── auth                       # Módulo de autenticação (JWT)
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── dtos/
│   ├── clients                    # Módulo de clientes
│   │   ├── clients.module.ts
│   │   ├── clients.service.ts
│   │   ├── clients.controller.ts
│   │   ├── dtos/
│   │   ├── entities
│   │   │   └── client.entity.ts
│   ├── products                   # Módulo de produtos
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   ├── products.controller.ts
│   │   ├── dtos/
│   │   ├── entities
│   │   │   └── product.entity.ts
│   ├── purchases                  # Módulo de compras
│   │   ├── purchases.module.ts
│   │   ├── purchases.service.ts
│   │   ├── purchases.controller.ts
│   │   ├── dtos/
│   │   ├── entities
│   │   │   └── purchase.entity.ts
│   └── common                     # Utilitários e guards
│       └── guards
│           └── jwt-auth.guard.ts
│           └── utils/password.utils.ts
├── test                           # Testes automatizados
│   ├── clients.e2e-spec.ts
│   └── products.e2e-spec.ts
│   └── purchases.e2e-spec.ts
├── .env                           # Variáveis de ambiente
├── docker-compose.yml             # Subida do banco de dados PostgreSQL
├── init.sql                       # Script de inicialização do banco
├── package.json                   # Configuração NPM
├── tsconfig.json                  # Configuração TypeScript
└── README.md                      # Documentação do projeto
└── README-QUESTÕES.md                      # Documentação das questões
```

## Funcionalidades

- Autenticação de clientes via JWT
- Cadastro, autenticação e listagem de clientes (sem expor senha)
- Cadastro e listagem de produtos
- Cadastro e listagem de compras

## Instalação

1. Clone o repositório:
   ```
   git clone <repository-url>
   ```

2. Acesse a pasta do projeto:
   ```
   cd rewards-club
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env` (já incluso no projeto).

## Banco de Dados

Para rodar o banco de dados localmente, utilize o Docker:

```
docker-compose up -d
```

Isso irá criar um banco PostgreSQL na porta **5430** com usuário e senha definidos no `.env`.

## Executando a Aplicação

Para iniciar a aplicação:
```
npm run start
```

Acesse a API em: [http://localhost:3000](http://localhost:3000)  
Acesse a documentação Swagger em: [http://localhost:3000/api](http://localhost:3000/api)

## Rotas Principais

### Clientes

- **POST /clientes**  
  Cadastra um novo cliente  
  Body: `{ name, email, password }`

- **GET /clientes**  
  Lista todos os clientes (rota pública)

### Autenticação

- **POST /autenticacao/login/cliente**  
  Autentica um cliente  (rota pública)
  Body: `{ email, password }`  
  Response: `{ access_token }`

### Produtos

- **POST /produtos**  
  Cadastra um novo produto (rota pública)
  Body: `{ name, description, price }`

- **GET /produtos**  
  Lista todos os produtos

### Compras

- **POST /compras**  
  (Protegida - requer JWT)  
  Realiza uma compra  
  Body: `{ productId, quantity }`

- **GET /compras**  
  Lista todas as compras

## Testes

Para rodar os testes:
```
npm run test:e2e
```

## Requisitos

- **Node.js**: v20.x
- **npm**: v10.x ou superior
- **Docker** (para rodar o banco de dados)