@echo off
setlocal
echo ===================================================
echo   Sync Entire Project to https://github.com/RupanjanDutta2006/Code
echo ===================================================
echo.

set /p TOKEN="Paste your GitHub Personal Access Token (or press Enter to try default Git login): "

if "%TOKEN%"=="" (
    echo Pushing with default credentials...
    git push -u origin main --force
) else (
    echo Pushing with provided token...
    git push https://%TOKEN%@github.com/RupanjanDutta2006/Code.git main --force
)

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo  [SUCCESS] All files uploaded to https://github.com/RupanjanDutta2006/Code
    echo  Ready for Vercel deployment!
    echo ===================================================
) else (
    echo [ERROR] Push failed. Please verify your token has 'repo' permissions.
)
echo.
pause
