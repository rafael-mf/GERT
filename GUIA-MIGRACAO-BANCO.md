# 🚀 GUIA RÁPIDO DE MIGRAÇÃO - BANCO DE DADOS GERT

## ⚡ EXPORTAR NO PC ATUAL (Este PC)

### Opção 1: Script Automático (RECOMENDADO)
```bash
# Execute no PowerShell ou CMD na pasta GERT
.\export-database.bat
```

### Opção 2: Manual via MySQL Workbench
1. Abra MySQL Workbench
2. Conecte no banco `gert_db`
3. Menu: **Server → Data Export**
4. Selecione: `gert_db`
5. Marque: **Dump Structure and Data**
6. Export to: **Self-Contained File**
7. Clique: **Start Export**
8. Salve como: `backup-database.sql`

### Opção 3: Linha de Comando Manual
```bash
# No CMD/PowerShell
mysqldump -u root -p gert_db > backup-database.sql
```

---

## 📦 TRANSFERIR PARA OUTRA MÁQUINA

Copie os seguintes arquivos:
- ✅ `backup-database.sql` (o backup)
- ✅ `import-database.bat` (script de importação)
- ✅ Pasta `gert-backend/` (código do backend)
- ✅ Pasta `gert-frontend/` (código do frontend)

---

## 📥 IMPORTAR NA OUTRA MÁQUINA

### PRÉ-REQUISITOS
1. **MySQL Server 8.0** instalado
2. **Node.js 18+** instalado
3. **Angular CLI** instalado: `npm install -g @angular/cli`

### Passo 1: Importar Banco de Dados

#### Opção A: Script Automático (RECOMENDADO)
```bash
# Execute na pasta onde está o backup-database.sql
.\import-database.bat
```

#### Opção B: Manual via MySQL Workbench
1. Abra MySQL Workbench
2. Conecte no servidor MySQL
3. Menu: **Server → Data Import**
4. Selecione: **Import from Self-Contained File**
5. Escolha: `backup-database.sql`
6. Target Schema: **Criar novo → gert_db**
7. Clique: **Start Import**

#### Opção C: Linha de Comando
```bash
# 1. Criar banco
mysql -u root -p -e "CREATE DATABASE gert_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Importar dados
mysql -u root -p gert_db < backup-database.sql

# 3. Verificar
mysql -u root -p gert_db -e "SHOW TABLES;"
```

---

### Passo 2: Configurar Backend

```bash
# Na pasta gert-backend

# 1. Copie o .env.example
copy .env.example .env

# 2. Edite o .env com as configurações do MySQL:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=gert_db

JWT_SECRET=seu_segredo_aqui_qualquer_string_longa
PORT=3000

# 3. Instale dependências
npm install

# 4. Inicie o servidor
npm start
```

O backend deve iniciar em: `http://localhost:3000`

---

### Passo 3: Configurar Frontend

```bash
# Na pasta gert-frontend

# 1. Instale dependências
npm install

# 2. Inicie o servidor de desenvolvimento
ng serve

# Ou npm start
```

O frontend deve iniciar em: `http://localhost:4200`

---

## 🔐 CREDENCIAIS DE ACESSO

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

## ✅ VERIFICAÇÃO RÁPIDA

### Testar Backend
```bash
# No navegador ou Postman
GET http://localhost:3000/api/health
# Deve retornar: {"status": "ok"}
```

### Testar Frontend
1. Abra: `http://localhost:4200`
2. Faça login com: `admin@gert.com` / `Admin@123`
3. Deve aparecer o dashboard

---

## 🆘 PROBLEMAS COMUNS

### ❌ "mysqldump não encontrado"
**Solução:** Adicione o MySQL ao PATH do Windows
```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### ❌ "Access denied for user 'root'"
**Solução:** Verifique a senha do MySQL no comando/script

### ❌ "Database already exists"
**Solução:** 
```sql
DROP DATABASE gert_db;
CREATE DATABASE gert_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Backend não conecta no banco
**Solução:** Verifique o arquivo `.env`:
- Senha do MySQL correta?
- Nome do banco é `gert_db`?
- MySQL está rodando?

### ❌ Frontend não conecta no backend
**Solução:** Verifique `gert-frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3000/api'
```

---

## 📊 ESTRUTURA DO BANCO

Após importação, você terá:
- ✅ 8 Status de Chamado (incluindo "Entregue")
- ✅ 4 Prioridades
- ✅ 5 Categorias de Dispositivos
- ✅ Usuários (Admin, Técnicos, Clientes)
- ✅ Chamados de exemplo
- ✅ Dispositivos cadastrados
- ✅ Serviços e peças

---

## 🎯 RESUMO SUPER RÁPIDO

**No PC atual:**
```bash
.\export-database.bat
```

**Na outra máquina:**
```bash
# 1. Importar banco
.\import-database.bat

# 2. Backend
cd gert-backend
copy .env.example .env
# Edite o .env com senha do MySQL
npm install
npm start

# 3. Frontend (em outro terminal)
cd gert-frontend
npm install
ng serve
```

**Acesse:** http://localhost:4200

**Login:** admin@gert.com / Admin@123

✅ **PRONTO!**

---

## 📞 Suporte

Se algum erro ocorrer:
1. Verifique os logs do terminal
2. Teste a conexão com o MySQL: `mysql -u root -p`
3. Verifique se todas as portas estão livres (3000, 3306, 4200)
4. Reinicie os serviços
