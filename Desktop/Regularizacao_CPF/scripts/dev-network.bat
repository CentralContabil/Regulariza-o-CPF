@echo off
REM Script para iniciar Next.js na rede local (Windows)

echo.
echo ========================================
echo   Iniciando Next.js na Rede Local
echo ========================================
echo.

REM Verificar IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo IP encontrado: !IP!
    goto :found
)

:found
echo.
echo Servidor estara disponivel em:
echo   Local:    http://localhost:4000
echo   Network:  http://%IP%:4000
echo.
echo Pressione Ctrl+C para parar
echo.

REM Configurar variáveis de ambiente e iniciar
set HOSTNAME=0.0.0.0
set PORT=4000
call npm run dev


