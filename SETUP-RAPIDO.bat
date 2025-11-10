@echo off
REM ================================================================
REM IMPORTAÇÃO SUPER RÁPIDA - OUTRA MÁQUINA
REM ================================================================

echo.
echo ========================================
echo   IMPORTACAO RAPIDA - BANCO GERT
echo ========================================
echo.

cd gert-backend

echo [1/4] Instalando dependencias do backend...
call npm install

echo.
echo [2/4] Importando banco de dados...
node import-backup.js

echo.
echo ========================================
echo.
echo Agora configure o .env:
echo   Edite: gert-backend\.env
echo   Linha: MYSQL_URL=mysql://root:SUA_SENHA@localhost:3306/gert
echo.
echo Depois execute:
echo   1. npm start (na pasta gert-backend)
echo   2. ng serve (na pasta gert-frontend)
echo.
echo ========================================
pause
