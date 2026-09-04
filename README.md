# 📚 StudyPath

<p align="center">
  <strong>Plan your goals. Build your future. 🚀</strong>
</p>

<p align="center">
  Uma aplicação web para organizar estudos, transformar objetivos em planos e acompanhar o progresso ao longo da jornada.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Flask-REST%20API-black?logo=flask">
  <img src="https://img.shields.io/badge/SQLite-database-blue?logo=sqlite">
  <img src="https://img.shields.io/badge/Tests-pytest-yellow?logo=pytest">
</p>

---

## ✨ Sobre o projeto

**StudyPath** é um projeto desenvolvido para facilitar o planejamento e a organização dos estudos.

A proposta é transformar uma meta de longo prazo em pequenas ações diárias, permitindo que o estudante acompanhe sua evolução de forma simples e organizada.

link do projeto : https://s0phiasoares.github.io/study.app/

### 🎯 Objetivo

> **Planejar melhor. Estudar com propósito. Acompanhar a evolução.**

O projeto combina uma interface web com uma API REST desenvolvida em Python/Flask e um banco de dados SQLite.

---

## 🚀 Funcionalidades

* 👤 Cadastro e gerenciamento de usuários
* 📚 Criação de planos de estudo
* 🎯 Definição de metas diárias
* 📈 Registro e acompanhamento de progresso
* 🔎 Consultas com paginação
* 🔌 API REST com respostas em JSON
* 🗄️ Banco de dados SQLite
* 🧪 Testes automatizados com Pytest
* ❤️ Endpoint de health check da API

---

## 🛠️ Tecnologias

| Tecnologia       | Utilização            |
| ---------------- | --------------------- |
| 🐍 **Python**    | Linguagem principal   |
| 🌶️ **Flask**    | Backend e API REST    |
| 🗄️ **SQLite**   | Banco de dados        |
| 🧪 **Pytest**    | Testes automatizados  |
| 🌐 **HTML**      | Estrutura das páginas |
| 🎨 **CSS**       | Estilização           |
| ⚡ **JavaScript** | Interatividade        |

---

## 📁 Estrutura do projeto

```text
study.app/
│
├── app/
│   ├── api/
│   │   ├── routes/
│   │   └── validation/
│   │
│   └── db/
│       ├── connection
│       └── schema
│
├── assets/
│   ├── scripts/
│   └── styles/
│
├── pages/
│   ├── dashboard.html
│   ├── my-path.html
│   ├── planner.html
│   ├── profile.html
│   └── study.html
│
├── tests/
│
├── index.html
├── requirements.txt
├── requirements-dev.txt
├── pytest.ini
├── run.py
└── README.md
```

---

## 🔌 API

A API utiliza o prefixo:

```text
/api/v1
```

### 👤 Usuários

```http
GET    /users
POST   /users
GET    /users/<id>
PUT    /users/<id>
DELETE /users/<id>
```

### 📚 Planos de estudo

```http
GET    /study-plans
POST   /study-plans
GET    /study-plans/<id>
PUT    /study-plans/<id>
DELETE /study-plans/<id>
```

### 🎯 Metas diárias

```http
GET    /study-plans/<id>/goals
POST   /study-plans/<id>/goals
GET    /goals/<id>
PUT    /goals/<id>
DELETE /goals/<id>
```

### 📈 Progresso

```http
GET    /study-plans/<id>/progress
POST   /study-plans/<id>/progress
GET    /progress/<id>
PUT    /progress/<id>
DELETE /progress/<id>
```

---

## ⚙️ Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/s0phiasoares/study.app.git
cd study.app
```

### 2. Crie um ambiente virtual

```bash
python -m venv .venv
```

### 3. Ative o ambiente virtual

**Windows:**

```bash
.venv\Scripts\activate
```

**Linux/macOS:**

```bash
source .venv/bin/activate
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

### 5. Execute o projeto

```bash
python run.py
```

Depois, abra no navegador:

```text
http://localhost:5000
```

### ❤️ Health Check

Para verificar se a API está funcionando:

```text
http://localhost:5000/api/v1/health
```

---

## 🧪 Executando os testes

O projeto possui testes automatizados utilizando **Pytest**.

Execute:

```bash
pytest
```

Para uma saída mais detalhada:

```bash
pytest -v
```

---

## 🗺️ Roadmap

* [x] Estrutura inicial do projeto
* [x] Backend com Flask
* [x] API REST
* [x] Banco de dados SQLite
* [x] Estrutura de planos de estudo
* [x] Metas diárias
* [x] Controle de progresso
* [x] Testes automatizados
* [ ] Sistema de autenticação
* [ ] Dashboard com gráficos
* [ ] Sistema de notificações
* [ ] Melhorias na interface
* [ ] Deploy da aplicação

---

## 💡 Aprendizados

Este projeto está sendo desenvolvido como uma forma prática de estudar e aplicar conceitos de:

* Desenvolvimento Web
* Python
* APIs REST
* Banco de Dados
* Arquitetura de aplicações
* Testes automatizados
* Git e GitHub
* Organização de projetos

---

## Autora 💻👩🏽‍💻

**Sophia Soares Barbosa**

Estudante de programação interessada em **Data Science, Python, desenvolvimento web e cibersegurança**.

<p align="center">
  Desenvolvido com 💜 e muito código.
</p>

---

## 📄 Licença

Este projeto está disponível para fins de estudo e desenvolvimento pessoal.
