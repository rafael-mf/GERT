# ⚡ GUIA RÁPIDO - Sistema GERT

## 🎯 Instalação Express (3 minutos)

### **Windows**
```cmd
1. Abra CMD/PowerShell como Administrador
2. Execute: install.bat
3. Siga as instruções na tela
4. Execute: start-all.bat
```

### **Mac/Linux**
```bash
1. Abra Terminal
2. Execute: chmod +x install.sh && ./install.sh
3. Siga as instruções na tela  
4. Execute: ./start-all.sh
```

---

## 🔧 Instalação Manual

### **1. Pré-requisitos**
- ✅ Node.js 18+
- ✅ MySQL 8.0+

### **2. Banco de Dados**
```sql
CREATE DATABASE gert;
```
```bash
mysql -u root -p gert < gert-db/init.sql
```

### **3. Backend**
```bash
cd gert-backend
npm install
cp .env.example .env
# Edite .env com suas configurações MySQL
npm start
```

### **4. Frontend**
```bash
cd gert-frontend  
npm install
npm start
```

---

## 🌐 Acesso ao Sistema

- **Frontend:** http://localhost:4200
- **Backend:** http://localhost:3001  
- **API Docs:** http://localhost:3001/api-docs

### **Login Padrão**
```
Email: admin@sistema.com
Senha: admin123
```

---

## 🚀 Deploy Online (Gratuito)

Consulte: **MANUAL-DEPLOY-ONLINE.md**

Serviços utilizados:
- 🔧 **Backend:** Railway (gratuito)
- 🗄️ **Banco:** PlanetScale (gratuito)
- 🅰️ **Frontend:** Vercel (gratuito)

---

## 🐛 Problemas Comuns

### **Erro de porta ocupada**
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :4200

# Mac/Linux  
lsof -ti:3001 | xargs kill
lsof -ti:4200 | xargs kill
```

### **Erro MySQL**
```bash
# Verificar se MySQL está rodando
# Windows: services.msc > MySQL
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### **Erro de dependências**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📚 Funcionalidades

### **✅ Implementadas**
- 👥 **Gestão completa** de chamados, clientes, técnicos
- 🔐 **Autenticação** JWT com níveis de acesso
- 📊 **Dashboard** interativo com estatísticas
- 🔍 **Busca e filtros** avançados com paginação
- 📱 **Interface responsiva** Bootstrap 5
- 📋 **Relatórios** administrativos

### **🚧 Em desenvolvimento**  
- ⚙️ **Configurações** do sistema
- 👤 **Perfil** do usuário
- 📧 **Notificações** por email
- 🔔 **Alertas** em tempo real

---

## 🎯 Estrutura do Sistema

```
GERT/
├── 📁 gert-backend/     # API Node.js + Express
├── 📁 gert-frontend/    # App Angular 17  
├── 📁 gert-db/          # Scripts MySQL
├── 📄 README.md         # Documentação completa
├── 📄 MANUAL-DEPLOY-ONLINE.md  # Deploy gratuito
├── 🔧 install.sh/.bat   # Instalação automática
└── ⚡ QUICK-START.md    # Este arquivo
```

---

## ✨ Melhorias Recentes

### **🔄 Script de População Seguro**
- ✅ **Novo:** `populate-safe.js` - Evita duplicatas de dados
- ✅ **Compatibilidade:** Mantém `populate-db.js` como backup
- ✅ **Uso:** `npm run populate` (recomendado)

### **🎨 UX Melhorada**
- ✅ **Modais Bootstrap:** Substituiram `confirm()` do navegador
- ✅ **Persistência de Token:** JWT mantido após reload da página
- ✅ **Tratamento de Erros:** Melhor feedback para usuário

### **🛡️ Segurança e Performance**
- ✅ **Validação de Token:** Verificação automática de expiração
- ✅ **Interceptors:** Tratamento robusto de autenticação
- ✅ **Logs de Auditoria:** Rastreamento de ações do usuário

---

## 🔄 Hash Routing:
- ✅ **URLs em produção:** `/#/dashboard` em vez de `/dashboard`
- ✅ **Compatibilidade:** Funciona com servidores estáticos
- ✅ **F5 Seguro:** Não dá mais 404 ao recarregar página

---

## 🛠️ Correções Técnicas
- ✅ **Field Mappings:** Corrigidos mapeamentos Sequelize para colunas snake_case
- ✅ **Foreign Keys:** Ajustadas referências entre tabelas
- ✅ **Model Sync:** Sincronização automática dos modelos em desenvolvimento
- ✅ **numeroSerie:** Removido de consultas do modelo Peca
- ✅ **chamadoId/usuarioId:** Mapeamento correto para snake_case
- ✅ **Queries Seguras:** Validadas sem erros de coluna

---

## 🗑️ Exclusão Segura:
- ✅ **Tabelas Existentes:** Remove apenas de tabelas que existem
- ✅ **Referências Corretas:** Usa apenas modelos válidos
- ✅ **Sem Tabelas Fantasma:** Evita erros de tabelas inexistentes

---

## 🆘 Suporte

1. 📖 **README.md** - Documentação completa
2. 🌐 **MANUAL-DEPLOY-ONLINE.md** - Deploy na nuvem
3. 🐛 **Issues** - Reporte problemas no GitHub
4. 💬 **Discussões** - Tire dúvidas na comunidade

---

**🎉 Sistema GERT - Pronto em 3 minutos! 🚀**