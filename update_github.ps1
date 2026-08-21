param (
    [string]$Message = "chore: update codevault pro codebase"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 CodeVault Pro - Sync to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$gitPath = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $gitPath)) {
    $gitPath = (Get-Command git -ErrorAction SilentlyContinue).Source
}

if (-not $gitPath) {
    Write-Host "❌ Git executable not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 1. Staging modified files..." -ForegroundColor Yellow
& $gitPath add .

Write-Host "📝 2. Creating commit: '$Message'..." -ForegroundColor Yellow
& $gitPath commit -m $Message

Write-Host "🚀 3. Pushing changes to https://github.com/RupanjanDutta2006/Code..." -ForegroundColor Green
& $gitPath push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully updated on GitHub!" -ForegroundColor Green
} else {
    Write-Host "⚠️ If this is your first push, run: git push -u origin main" -ForegroundColor Yellow
}
