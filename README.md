# 🎯 GERT - Gerenciador de Chamados Técnicos

link homologação: https://gert-xi.vercel.app/

> **Sistema completo para gerenciamento de chamados de assistência técnica**

Sistema profissional para gestão de assistência técnica de celulares e computadores, com interface moderna e funcionalidades completas para controle de chamados, técnicos, clientes e serviços.

## 🚀 Funcionalidades Principais

### ✅ **Gestão Completa de Chamados**
- 📋 **Abertura e acompanhamento** de chamados com status em tempo real
- 👨‍🔧 **Atribuição automática** de técnicos especializados
- ⚡ **Sistema de prioridades** (Baixa, Normal, Alta, Urgente)
- 🔍 **Diagnósticos detalhados** e soluções documentadas
- 📊 **Dashboard interativo** com estatísticas em tempo real
- 🔄 **Histórico completo** de alterações e atualizações

### 👥 **Gestão de Usuários e Equipe**
- 🔐 **Sistema de autenticação** JWT com diferentes níveis de acesso
- 👨‍💼 **Gestão de técnicos** com especialidades e disponibilidade
- 👤 **Perfis de clientes** com histórico completo
- 🛡️ **Controle de permissões** (Administrador, Técnico, Atendente)

### 🛠️ **Controle de Serviços e Peças**
- 🔧 **Catálogo de serviços** com preços e tempos estimados
- 📦 **Controle de peças** utilizadas em cada chamado
- 💰 **Gestão financeira** básica por chamado
- 📋 **Relatórios administrativos** (apenas administradores)

### 🎨 **Interface Moderna**
- 📱 **Design responsivo** para desktop, tablet e mobile
- 🎯 **Interface intuitiva** baseada em Bootstrap 5
- ⚡ **Navegação rápida** com busca e filtros avançados
- 📊 **Visualizações gráficas** com NgBootstrap e Charts

## 🛠️ Stack Tecnológica

### **Backend (Node.js)**
```
🟢 Node.js 18+ + Express.js
🔗 Sequelize ORM + MySQL 8.0
🔐 JWT Authentication + Bcrypt
✅ Joi Validation + Helmet Security
📚 Swagger Documentation
🏗️ Arquitetura MVC organizada
```

### **Frontend (Angular 17)**
```
🅰️ Angular 17 + TypeScript
🎨 Bootstrap 5 + NgBootstrap
📊 Swimlane Charts + FontAwesome
🔔 Toastr Notifications
🏗️ Standalone Components
📱 Design Responsivo
```

### **Banco de Dados (MySQL)**
```
🗄️ MySQL 8.0
📊 Relacionamentos otimizados
� Paginação server-side
📈 Índices para performance
```

## ⚡ Instalação Rápida

### **Pré-requisitos**
```bash
✅ Node.js 18 ou superior
✅ MySQL 8.0 ou superior
✅ Git (opcional)
```

### **1️⃣ Clonar/Baixar Projeto**
```bash
# Opção 1: Git
git clone <repository-url>
cd GERT

# Opção 2: Download ZIP e extrair
```

### **2️⃣ Configurar Banco de Dados**
```bash
# 1. Criar banco no MySQL
mysql -u root -p
CREATE DATABASE gert;
exit

# 2. Executar script de inicialização
mysql -u root -p gert < gert-db/init.sql
```

### **3️⃣ Configurar Backend**
```bash
# Navegar para backend
cd gert-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar servidor
npm start
```
✅ **Backend rodando em:** http://localhost:3001

### **4️⃣ Configurar Frontend**
```bash
# Navegar para frontend
cd ../gert-frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm start
```
✅ **Frontend rodando em:** http://localhost:4200

## 🔐 Credenciais Padrão

```
📧 Email: admin@sistema.com
🔑 Senha: Admin@123
👑 Nível: Administrador
```

## � Como Usar o Sistema

### **1. Dashboard Inicial**
- 📊 Visualize estatísticas gerais
- 🔍 Acesse chamados em aberto
- ⚡ Monitore atividades recentes

### **2. Gestão de Chamados**
- ➕ **Criar:** Menu Chamados > Novo Chamado
- 👁️ **Visualizar:** Lista paginada com filtros
- ✏️ **Editar:** Clique no chamado desejado
- ✅ **Fechar:** Adicione diagnóstico e solução

### **3. Administração** (Somente Admins)
- 👥 **Técnicos:** Cadastrar e gerenciar equipe
- � **Clientes:** Manter base de clientes
- 🔧 **Serviços:** Catálogo de serviços
- � **Relatórios:** Análises gerenciais

## 🎯 Estrutura do Projeto

```
GERT/
├── 🔧 gert-backend/           # API REST Node.js
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── models/           # Modelos Sequelize
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Camada de serviços
│   │   └── middlewares/      # Autenticação e validações
│   └── package.json
├── 🅰️ gert-frontend/          # App Angular 17
│   ├── src/app/
│   │   ├── core/            # Serviços essenciais
│   │   ├── features/        # Módulos funcionais
│   │   ├── shared/          # Componentes compartilhados
│   │   └── layouts/         # Layouts da aplicação
│   └── package.json
└── 🗄️ gert-db/               # Scripts do banco
    ├── init.sql             # Estrutura inicial
    └── dados-exemplo.sql    # Dados de teste
```

## 🔧 Comandos Úteis

### **Backend**
```bash
npm start          # Produção
npm run dev        # Desenvolvimento com nodemon
npm test           # Executar testes
npm run lint       # Verificar código
```

### **Frontend**
```bash
npm start          # Desenvolvimento (porta 4200)
npm run build      # Build de produção
npm test           # Executar testes
```

## 📚 Documentação da API

Com o backend rodando, acesse:
- 📖 **Swagger UI:** http://localhost:3001/api-docs
- 🔍 **Endpoints:** Documentação interativa completa

## 🐛 Resolução de Problemas

### **Erro de Conexão MySQL**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql  # Linux
net start mysql              # Windows

# Verificar credenciais no .env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=gert
```

### **Erro de Porta Ocupada**
```bash
# Backend (porta 3001)
lsof -ti:3001 | xargs kill  # Mac/Linux
netstat -ano | findstr 3001 # Windows

# Frontend (porta 4200)
lsof -ti:4200 | xargs kill  # Mac/Linux
netstat -ano | findstr 4200 # Windows
```

### **Problemas de Dependências**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🤝 Suporte e Contribuição

### **Reportar Problemas**
- 🐛 Abra uma issue descrevendo o problema
- 📝 Inclua logs de erro e passos para reproduzir

### **Melhorias**
- 💡 Sugestões são bem-vindas
- 🚀 Pull requests devem seguir os padrões do projeto

---

## 📊 Status Atual

```
🟢 Sistema Operacional: 100%
🟢 Funcionalidades Core: 100%
🟢 Interface de Usuário: 100%
🟢 Autenticação: 100%
🟢 Paginação: 100%
🟡 Configurações/Perfil: Em desenvolvimento
🔴 Testes Automatizados: Pendente
```

**🎯 SISTEMA GERT - PRONTO PARA USO**

*Desenvolvido com foco em produtividade e facilidade de uso* 🚀
