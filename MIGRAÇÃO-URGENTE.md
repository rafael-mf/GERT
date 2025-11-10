# 🚨 MIGRAÇÃO URGENTE - GERT PARA OUTRA MÁQUINA

## ✅ PASSO 1: ARQUIVOS PARA COPIAR (NESTE PC)

Copie TODA a pasta `GERT` para a outra máquina, ou pelo menos:

### Essenciais:
1. ✅ **backup-database.sql** (49 KB - BACKUP DO BANCO!)
2. ✅ **gert-backend/** (pasta completa)
3. ✅ **gert-frontend/** (pasta completa)

### Opcionais mas úteis:
4. **GUIA-MIGRACAO-BANCO.md** (guia detalhado)
5. **import-database.bat** (script de importação Windows)

---

## ⚡ PASSO 2: NA OUTRA MÁQUINA

### PRÉ-REQUISITOS (INSTALAR NA ORDEM):

1. **MySQL 8.0** → https://dev.mysql.com/downloads/mysql/
   - Durante instalação, defina senha root (ex: `root`)
   - Marque opção "Start MySQL Server"

2. **Node.js 18+** → https://nodejs.org/ (LTS)

3. **Angular CLI** (após instalar Node):
   ```bash
   npm install -g @angular/cli
   ```

---

## 🔥 PASSO 3: IMPORTAR BANCO (ESCOLHA UMA OPÇÃO)

### OPÇÃO A: Automático via Node.js (RECOMENDADO)

```bash
# 1. Entre na pasta
cd caminho/para/GERT/gert-backend

# 2. Instale dependências
npm install

# 3. Execute o importador
node import-backup.js

# 4. Confirme com 's' quando perguntar
```

### OPÇÃO B: Manual via MySQL Command Line

```bash
# 1. Abra o terminal/cmd

# 2. Conecte no MySQL
mysql -u root -p
# Digite a senha do MySQL

# 3. Cole os comandos:
DROP DATABASE IF EXISTS gert;
CREATE DATABASE gert CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gert;
SOURCE C:/caminho/para/GERT/backup-database.sql;
exit;
```

### OPÇÃO C: Via MySQL Workbench (Interface Gráfica)

1. Abra MySQL Workbench
2. Conecte no servidor local
3. Menu: **Server → Data Import**
4. Selecione: **Import from Self-Contained File**
5. Escolha o arquivo: `backup-database.sql`
6. **Default Target Schema:** Digite `gert` e clique "New..."
7. Clique: **Start Import**
8. Aguarde concluir

---

## 🎯 PASSO 4: CONFIGURAR BACKEND

```bash
# 1. Entre na pasta
cd GERT/gert-backend

# 2. Copie o arquivo de exemplo
copy .env.example .env
# Linux/Mac: cp .env.example .env

# 3. Edite o arquivo .env com NOTEPAD ou VS Code
# Altere apenas esses campos:

NODE_ENV=development
PORT=3001

MYSQL_URL=mysql://root:SUA_SENHA_MYSQL@localhost:3306/gert

JWT_SECRET=ROSQUINHA777
JWT_EXPIRATION=24h

FRONTEND_URL=http://localhost:4200

# 4. Instale dependências (se ainda não instalou)
npm install

# 5. INICIE O BACKEND
npm start
```

**✅ BACKEND DEVE MOSTRAR:**
```
Server running on port 3001
Database connected successfully
```

---

## 🎨 PASSO 5: CONFIGURAR FRONTEND

**Abra OUTRO terminal** (deixe o backend rodando!):

```bash
# 1. Entre na pasta
cd GERT/gert-frontend

# 2. Instale dependências
npm install
# (Aguarde... pode demorar 2-5 minutos)

# 3. INICIE O FRONTEND
ng serve
# ou: npm start
```

**✅ FRONTEND DEVE MOSTRAR:**
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

---

## 🔐 PASSO 6: ACESSAR O SISTEMA

1. Abra o navegador
2. Acesse: **http://localhost:4200**
3. Faça login:

**Administrador:**
- Email: `admin@gert.com`
- Senha: `Admin@123`

**Técnico:**
- Email: `joao.silva@gert.com`
- Senha: `Admin@123`

**Cliente:**
- Email: `maria.santos@empresa.com`
- Senha: `Admin@123`

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Unknown database 'gert'"
→ O banco não foi importado. Volte ao PASSO 3.

### ❌ "Access denied for user 'root'"
→ Senha errada no .env. Edite e ajuste MYSQL_URL.

### ❌ "connect ECONNREFUSED"
→ MySQL não está rodando. Inicie o serviço MySQL.

### ❌ Backend não inicia
→ Verifique se a porta 3001 está livre:
```bash
netstat -ano | findstr :3001
```

### ❌ Frontend não inicia
→ Verifique se a porta 4200 está livre:
```bash
netstat -ano | findstr :4200
```

### ❌ "Cannot find module 'mysql2'"
→ Execute: `npm install` na pasta gert-backend

---

## 📋 CHECKLIST RÁPIDO

- [ ] MySQL 8.0 instalado e rodando
- [ ] Node.js 18+ instalado
- [ ] Angular CLI instalado (`npm install -g @angular/cli`)
- [ ] Arquivos copiados (backup-database.sql + pastas)
- [ ] Banco importado (via import-backup.js ou manual)
- [ ] .env configurado com senha correta
- [ ] Backend instalado (`npm install`)
- [ ] Backend rodando (`npm start`) na porta 3001
- [ ] Frontend instalado (`npm install`)
- [ ] Frontend rodando (`ng serve`) na porta 4200
- [ ] Login funciona em http://localhost:4200

---

## ⚡ RESUMO SUPER RÁPIDO (Se tudo instalado)

```bash
# Terminal 1 - IMPORTAR BANCO
cd GERT/gert-backend
npm install
node import-backup.js
# Confirme com 's'

# Edite o .env com senha do MySQL
# MYSQL_URL=mysql://root:SUA_SENHA@localhost:3306/gert

# INICIE BACKEND
npm start

# Terminal 2 - FRONTEND
cd GERT/gert-frontend
npm install
ng serve

# Acesse: http://localhost:4200
# Login: admin@gert.com / Admin@123
```

---

## 📞 ESTRUTURA DO BANCO IMPORTADO

Após importação bem-sucedida, você terá:

- ✅ **18 tabelas**
- ✅ **Usuários**: Admin, Técnicos, Clientes
- ✅ **Chamados** com histórico
- ✅ **8 Status** (incluindo "Entregue")
- ✅ **4 Prioridades**
- ✅ **Dispositivos** cadastrados
- ✅ **Serviços e peças**
- ✅ **Logs e atualizações**

**Tamanho total:** ~49 KB

---

## ✅ PRONTO!

Se tudo funcionou, você deve ver:
- Backend rodando na porta 3001
- Frontend acessível em http://localhost:4200
- Sistema completo com todos os dados migrados!

🎉 **BOA SORTE!**
