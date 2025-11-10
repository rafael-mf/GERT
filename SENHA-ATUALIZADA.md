# 🔐 Atualização de Senha do Administrador

**Data:** 03/11/2025

## Senha Atualizada

A senha padrão do administrador foi atualizada em todos os arquivos do sistema:

- **Senha Antiga:** `admin123`
- **Senha Nova:** `Admin@123`
- **Hash BCrypt:** `$2a$10$XyB4jAoQ/y4bvOBE/qB53e4nOIJC.bhYjQBIM8ZwxXoCQW2hjTjiG`

## Credenciais de Login

```
📧 Email: admin@sistema.com (local) ou admin@gert.com (railway)
🔑 Senha: Admin@123
👑 Perfil: Administrador
```

## Arquivos Atualizados

### Scripts de Banco de Dados (SQL)
- ✅ `gert-db/init-sql.sql` - Script de inicialização local
- ✅ `gert-db/railway-init.sql` - Script de inicialização Railway

### Scripts de População (JavaScript)
- ✅ `gert-backend/populate-safe.js` - Script seguro de população
- ✅ `gert-backend/populate-db.js` - Documentação atualizada
- ✅ `gert-backend/populate-banco-completo.js` - População completa

### Utilitários
- ✅ `gert-backend/fix-admin-password.js` - Script de correção de senha
- ✅ `gert-backend/generate-admin-hash.js` - Gerador de hash

### Documentação
- ✅ `README.md` - Documentação principal
- ⚠️ Outros arquivos de documentação podem conter referências antigas

## Como Aplicar em Banco Existente

### Opção 1: Via Script Node.js

```bash
cd gert-backend
node fix-admin-password.js
```

### Opção 2: Via SQL Direto

```sql
UPDATE usuarios 
SET senha = '$2a$10$XyB4jAoQ/y4bvOBE/qB53e4nOIJC.bhYjQBIM8ZwxXoCQW2hjTjiG' 
WHERE email = 'admin@sistema.com' OR email = 'admin@gert.com';
```

### Opção 3: Recriar Banco

```bash
# Local
mysql -u root -p gert < gert-db/init-sql.sql

# Railway (via console do Railway)
# Cole o conteúdo de railway-init.sql
```

## Verificação

Para verificar se a senha está correta:

```bash
cd gert-backend
node -e "
const bcrypt = require('bcryptjs');
const hash = '\$2a\$10\$XyB4jAoQ/y4bvOBE/qB53e4nOIJC.bhYjQBIM8ZwxXoCQW2hjTjiG';
console.log('Senha Admin@123:', bcrypt.compareSync('Admin@123', hash));
console.log('Senha admin123:', bcrypt.compareSync('admin123', hash));
"
```

Resultado esperado:
```
Senha Admin@123: true
Senha admin123: false
```

## Observações Importantes

⚠️ **Arquivos que ainda podem ter referências antigas:**
- Scripts de teste (test-local-setup.ps1, test-backend-recovery.sh, etc.)
- Documentação de deploy (MANUAL-DEPLOY-ONLINE.md, etc.)
- Scripts de instalação (install.sh, install.bat)
- Component de login (login.component.ts - apenas exemplo)

Esses arquivos foram mantidos com a senha antiga intencionalmente ou são exemplos que devem ser atualizados conforme necessário.

## Segurança

🔒 **Recomendações:**
1. Altere a senha padrão após o primeiro login
2. Use senhas fortes e únicas para cada ambiente
3. Não compartilhe credenciais em repositórios públicos
4. Configure variáveis de ambiente para senhas em produção

---

**Última atualização:** 03/11/2025
