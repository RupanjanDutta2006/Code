<#
.SYNOPSIS
    CodeVault Pro - Vercel Deployment Diagnostic & Health Verification Script
.DESCRIPTION
    Automates inspection of latest Vercel deployment, logs, and live production endpoints.
#>

param (
    [string]$ProdUrl = "https://codevault-pro-weld.vercel.app"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     CodeVault Pro -- Vercel Live Diagnostic Check        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target Production URL: $ProdUrl`n" -ForegroundColor White

# 1. Inspect Homepage
try {
    Write-Host "[1/5] Checking Production Homepage..." -ForegroundColor Yellow
    $home = Invoke-WebRequest -Uri $ProdUrl -UseBasicParsing
    Write-Host "  -> [PASS] Homepage HTTP Status: $($home.StatusCode) ($($home.Content.Length) bytes)" -ForegroundColor Green
} catch {
    Write-Host "  -> [FAIL] Homepage Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Inspect SPA Routes
try {
    Write-Host "[2/5] Checking SPA Routing (/my-class, /compiler)..." -ForegroundColor Yellow
    $myClass = Invoke-WebRequest -Uri "$ProdUrl/my-class" -UseBasicParsing
    $compiler = Invoke-WebRequest -Uri "$ProdUrl/compiler" -UseBasicParsing
    Write-Host "  -> [PASS] /my-class Status: $($myClass.StatusCode) | /compiler Status: $($compiler.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  -> [FAIL] SPA Route Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Inspect Cloud Compiler API
try {
    Write-Host "[3/5] Checking Cloud Compiler Health (/api/health)..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "$ProdUrl/api/health" -Method Get
    Write-Host "  -> [PASS] Compiler Engine: $($health.engine) (v$($health.version))" -ForegroundColor Green
} catch {
    Write-Host "  -> [FAIL] Compiler Health Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Inspect FastAPI Backend
try {
    Write-Host "[4/5] Checking FastAPI Backend Endpoints (/api/programs)..." -ForegroundColor Yellow
    $programs = Invoke-RestMethod -Uri "$ProdUrl/api/programs" -Method Get
    Write-Host "  -> [PASS] FastAPI Programs Route: $($programs.Count) programs retrieved" -ForegroundColor Green
} catch {
    Write-Host "  -> [FAIL] FastAPI Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Inspect AI Service Health
try {
    Write-Host "[5/5] Checking AI Service Health (/api/ai/health)..." -ForegroundColor Yellow
    $aiHealth = Invoke-RestMethod -Uri "$ProdUrl/api/ai/health" -Method Get
    Write-Host "  -> [PASS] AI Service: $($aiHealth.service) ($($aiHealth.model))" -ForegroundColor Green
} catch {
    Write-Host "  -> [FAIL] AI Service Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " [COMPLETED] Production Health Verification Complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
