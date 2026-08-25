<#
.SYNOPSIS
    CodeVault Pro - Safe GitHub Push Script (Target: S0u1k/Code-Vault-Pro)
.DESCRIPTION
    Safely commits and pushes verified source code to https://github.com/S0u1k/Code-Vault-Pro
    - Zero tokens in URLs
    - Zero force-pushes
    - Verifies repository destination
#>

param (
    [string]$Message = "chore: update CodeVault Pro platform"
)

$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " CodeVault Pro -- Safe Repository Synchronization  " -ForegroundColor Cyan
Write-Host " Target: https://github.com/S0u1k/Code-Vault-Pro   " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Locate Git
$gitPath = $null
$possibleGitPaths = @(
    "git",
    "C:\Program Files\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe"
)

foreach ($p in $possibleGitPaths) {
    if ($p -eq "git") {
        $cmd = Get-Command git -ErrorAction SilentlyContinue
        if ($cmd) { $gitPath = "git"; break }
    } else {
        $found = Resolve-Path $p -ErrorAction SilentlyContinue | Select-Object -Last 1
        if ($found -and (Test-Path $found.Path)) {
            $gitPath = $found.Path
            break
        }
    }
}

if (-not $gitPath) {
    Write-Host "[-] Git executable not found. Please ensure Git or GitHub Desktop is installed." -ForegroundColor Red
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Verify and set remote origin
Write-Host "[1/4] Verifying remote origin configuration..." -ForegroundColor Yellow
$currentOrigin = & $gitPath -C $ScriptDir config --get remote.origin.url
$targetOrigin = "https://github.com/S0u1k/Code-Vault-Pro.git"

if ($currentOrigin -ne $targetOrigin) {
    Write-Host "  -> Updating remote origin to $targetOrigin" -ForegroundColor Cyan
    & $gitPath -C $ScriptDir remote set-url origin $targetOrigin
}

# 2. Stage verified changes
Write-Host "[2/4] Staging modified files (respecting .gitignore)..." -ForegroundColor Yellow
& $gitPath -C $ScriptDir add -A

# Check if there are changes to commit
$status = & $gitPath -C $ScriptDir status --porcelain
if ($status) {
    Write-Host "[3/4] Creating commit: '$Message'..." -ForegroundColor Yellow
    & $gitPath -C $ScriptDir commit -m "$Message"
} else {
    Write-Host "[3/4] Working tree clean (no new uncommitted modifications)." -ForegroundColor Green
}

# 4. Safe Push
Write-Host "[4/4] Safely pushing to origin main..." -ForegroundColor Green
& $gitPath -C $ScriptDir push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Successfully synchronized to https://github.com/S0u1k/Code-Vault-Pro!" -ForegroundColor Green
} else {
    Write-Host "`n[-] Push encountered an issue. Check network/authentication." -ForegroundColor Red
    exit 1
}
