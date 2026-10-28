@echo off
REM Levanta un servidor local para previsualizar el sitio.
REM Abrir http://localhost:8090 en el navegador.
cd /d "%~dp0"
python -m http.server 8090
