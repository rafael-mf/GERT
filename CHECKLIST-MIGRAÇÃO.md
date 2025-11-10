# ✅ CHECKLIST DE MIGRAÇÃO - GERT

## 📦 ARQUIVOS PARA COPIAR

Copie TODA a pasta GERT, que inclui:

### Essenciais (OBRIGATÓRIOS):
- [x] **backup-database.sql** (50 KB) - ⭐ BACKUP DO BANCO
- [x] **gert-backend/** - Pasta completa do backend
- [x] **gert-frontend/** - Pasta completa do frontend

### Guias (RECOMENDADOS):
- [x] **MIGRAÇÃO-URGENTE.md** - Guia completo detalhado
- [x] **LEIA-PRIMEIRO.txt** - Resumo rápido
- [x] **SETUP-RAPIDO.bat** - Script de instalação automática

---

## 🖥️ PREPARAÇÃO NA OUTRA MÁQUINA

### Instalações Necessárias:

| Software | Versão | Status | Link |
|----------|--------|--------|------|
| MySQL Server | 8.0+ | ⬜ | https://dev.mysql.com/downloads/mysql/ |
| Node.js | 18+ LTS | ⬜ | https://nodejs.org/ |
| Angular CLI | Latest | ⬜ | `npm install -g @angular/cli` |

**IMPORTANTE:** Anote a senha do root do MySQL durante a instalação!

---

## 🔄 PROCESSO DE IMPORTAÇÃO

### Método 1: Automático (RECOMENDADO)

```bash
# 1. Abra o terminal na pasta GERT
cd caminho/para/GERT

# 2. Execute o script
SETUP-RAPIDO.bat

# 3. Aguarde e siga as instruções
```

### Método 2: Manual (Passo a Passo)

**Passo 1: Importar Banco**
```bash
cd gert-backend
npm install
node import-backup.js
```
- [ ] Terminal mostra "✅ IMPORTAÇÃO CONCLUÍDA"
- [ ] 18 tabelas foram criadas

**Passo 2: Configurar .env**
```bash
# Edite: gert-backend/.env
# Altere a linha:
MYSQL_URL=mysql://root:SUA_SENHA_MYSQL@localhost:3306/gert
```
- [ ] Senha do MySQL está correta
- [ ] Nome do banco é "gert"

**Passo 3: Iniciar Backend**
```bash
npm start
```
- [ ] Porta 3001 está livre
- [ ] Mostra "Server running on port 3001"
- [ ] Mostra "Database connected successfully"

**Passo 4: Iniciar Frontend** (novo terminal)
```bash
cd gert-frontend
npm install
ng serve
```
- [ ] Porta 4200 está livre
- [ ] Mostra "Compiled successfully"
- [ ] Servidor rodando em http://localhost:4200

**Passo 5: Teste de Login**
```
URL: http://localhost:4200
Email: admin@gert.com
Senha: Admin@123
```
- [ ] Página de login carrega
- [ ] Login é aceito
- [ ] Dashboard aparece
- [ ] Dados estão presentes

---

## 🔍 VERIFICAÇÕES

### Banco de Dados:
```sql
mysql -u root -p
USE gert;
SHOW TABLES;
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM chamados;
```
- [ ] 18 tabelas existem
- [ ] Usuários foram importados (deve ter pelo menos 3)
- [ ] Chamados foram importados

### Backend:
```bash
# Teste a API
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```
- [ ] API responde
- [ ] Status é "ok"

### Frontend:
- [ ] http://localhost:4200 carrega
- [ ] Login funciona
- [ ] Dashboard mostra dados
- [ ] Menu lateral funciona
- [ ] Tabelas carregam

---

## 🎯 CREDENCIAIS

### Administrador (Acesso Total):
- **Email:** admin@gert.com
- **Senha:** Admin@123
- **Cargo:** Administrador

### Técnico (Chamados):
- **Email:** joao.silva@gert.com
- **Senha:** Admin@123
- **Cargo:** Técnico

### Cliente (Visualização):
- **Email:** maria.santos@empresa.com
- **Senha:** Admin@123
- **Cargo:** Cliente

---

## 🆘 TROUBLESHOOTING

### ❌ "Unknown database 'gert'"
**Causa:** Banco não foi importado  
**Solução:**
```bash
cd gert-backend
node import-backup.js
```

### ❌ "Access denied for user 'root'"
**Causa:** Senha incorreta no .env  
**Solução:** Edite `gert-backend/.env`, corrija a senha

### ❌ "connect ECONNREFUSED"
**Causa:** MySQL não está rodando  
**Solução:** 
- Windows: Services → MySQL → Iniciar
- Ou: `net start MySQL80`

### ❌ "Port 3001 already in use"
**Causa:** Porta ocupada  
**Solução:**
```bash
# Encontre o processo
netstat -ano | findstr :3001

# Mate o processo (use o PID da saída acima)
taskkill /PID <numero> /F

# Ou altere a porta no .env
PORT=3002
```

### ❌ "Cannot find module 'mysql2'"
**Causa:** Dependências não instaladas  
**Solução:**
```bash
cd gert-backend
npm install
```

### ❌ Frontend não conecta no backend
**Causa:** URL do backend incorreta  
**Solução:** Verifique `gert-frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3001/api'
```

---

## 📊 DADOS IMPORTADOS

Após importação bem-sucedida:

| Tabela | Descrição | Quantidade Aprox. |
|--------|-----------|-------------------|
| usuarios | Admin, técnicos, clientes | 3+ |
| chamados | Chamados abertos/fechados | Varia |
| status_chamados | 8 status (inc. Entregue) | 8 |
| prioridades | Baixa, Normal, Alta, Urgente | 4 |
| dispositivos | Equipamentos | Varia |
| servicos | Serviços disponíveis | Varia |
| pecas | Peças do estoque | Varia |
| tecnicos | Técnicos cadastrados | Varia |
| clientes | Empresas/pessoas | Varia |

**Total:** 18 tabelas, ~50 KB de dados

---

## ✅ MIGRAÇÃO COMPLETA

Se você marcou todos os checkboxes acima, a migração foi bem-sucedida! 🎉

**Sistema Funcional:**
- ✅ Banco de dados importado
- ✅ Backend rodando
- ✅ Frontend rodando
- ✅ Login funciona
- ✅ Dados estão presentes

**Próximos passos:**
1. Teste todas as funcionalidades
2. Crie um novo chamado de teste
3. Verifique relatórios
4. Configure backups automáticos

---

## 📝 NOTAS IMPORTANTES

1. **Senha padrão:** Todos os usuários importados usam senha `Admin@123`
2. **Banco local:** O sistema está configurado para MySQL local (localhost)
3. **Dados de desenvolvimento:** O backup contém dados de teste
4. **Backup regular:** Configure backups automáticos do banco
5. **Segurança:** Altere senhas padrão em produção

---

**Última atualização:** 10/11/2025  
**Versão do backup:** 1.0  
**Tamanho do backup:** 50 KB  
**Tabelas:** 18
