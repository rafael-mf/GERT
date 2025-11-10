@echo off
REM ================================================================
REM SCRIPT DE IMPORTAÇÃO DO BANCO DE DADOS - OUTRA MÁQUINA
REM ================================================================

echo ========================================
echo IMPORTANDO BANCO DE DADOS GERT
echo ========================================
echo.

REM Configurações do MySQL
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_NAME=gert_db
set BACKUP_FILE=backup-database.sql

echo ATENÇÃO: Este script vai RECRIAR o banco de dados!
echo Configurações:
echo   Host: %DB_HOST%
echo   Database: %DB_NAME%
echo   Arquivo: %BACKUP_FILE%
echo.

REM Verificar se o arquivo de backup existe
if not exist "%BACKUP_FILE%" (
    echo [ERRO] Arquivo backup-database.sql não encontrado!
    echo Certifique-se de que o arquivo está na mesma pasta deste script.
    echo.
    pause
    exit /b 1
)

echo [INFO] Arquivo de backup encontrado!
echo.

REM Verificar se mysql existe
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] mysql não encontrado no PATH!
    echo.
    echo Solucoes:
    echo 1. Adicione o MySQL bin ao PATH do Windows
    echo 2. Instale o MySQL Server 8.0
    echo.
    pause
    exit /b 1
)

echo Digite a senha do MySQL root:
set /p DB_PASS=Senha: 

echo.
echo [1/3] Criando banco de dados...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% -e "DROP DATABASE IF EXISTS %DB_NAME%; CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar banco de dados!
    echo Verifique a senha e se o MySQL está rodando.
    pause
    exit /b 1
)

echo [2/3] Importando estrutura e dados...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < "%BACKUP_FILE%"

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao importar dados!
    pause
    exit /b 1
)

echo [3/3] Verificando importação...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SHOW TABLES;"

echo.
echo ========================================
echo ✓ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!
echo ========================================
echo.
echo PRÓXIMOS PASSOS:
echo.
echo 1. Configure o arquivo .env no gert-backend:
echo    DB_HOST=localhost
echo    DB_PORT=3306
echo    DB_USER=root
echo    DB_PASSWORD=sua_senha
echo    DB_NAME=gert_db
echo.
echo 2. No gert-backend, execute:
echo    npm install
echo    npm start
echo.
echo 3. No gert-frontend, execute:
echo    npm install
echo    ng serve
echo.
echo 4. Acesse: http://localhost:4200
echo    Login: admin@gert.com
echo    Senha: Admin@123
echo.

pause
