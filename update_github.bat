@echo off
setlocal
echo ========================================
echo   CodeVault Pro - Push to GitHub
echo ========================================

set GIT_EXE="C:\Program Files\Git\cmd\git.exe"

set /p MSG="Enter commit message (or press Enter for default): "
if "%MSG%"=="" set MSG="chore: update CodeVault Pro platform"

echo.
echo [1/3] Adding modified files...
%GIT_EXE% add .

echo.
echo [2/3] Committing changes...
%GIT_EXE% commit -m "%MSG%"

echo.
echo [3/3] Pushing to https://github.com/RupanjanDutta2006/Code-Vault_Pro...
%GIT_EXE% push -u origin main

echo.
echo ========================================
echo   Done!
echo ========================================
pause
