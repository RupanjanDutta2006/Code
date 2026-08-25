@echo off
setlocal
echo ===================================================
echo   CodeVault Pro -- Safe GitHub Push Workflow
echo   Target: https://github.com/S0u1k/Code-Vault-Pro
echo ===================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0update_github.ps1"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo  [SUCCESS] CodeVault Pro synchronized to GitHub!
    echo ===================================================
) else (
    echo.
    echo [ERROR] Update failed with error code %ERRORLEVEL%.
)
echo.
pause
