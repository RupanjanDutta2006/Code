<#
.SYNOPSIS
    CodeVault Pro - Dedicated E-Drive Firebase Environment Launcher
.DESCRIPTION
    Configures environment variables to keep all Firebase CLI operations,
    npm download cache, temp files, and logs strictly isolated inside E:\Code Vault pro\Cache.
#>

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$CommandArgs
)

$ErrorActionPreference = "Stop"

$ProjectRoot = "E:\Code Vault pro\Code"
$CacheRoot = "E:\Code Vault pro\Cache"

$FirebaseCliDir = Join-Path $CacheRoot "firebase-cli"
$FirebaseBin = Join-Path $FirebaseCliDir "node_modules\.bin\firebase.cmd"
$NpmCacheDir = Join-Path $CacheRoot "node\npm-cache"
$DownloadsDir = Join-Path $CacheRoot "downloads"
$TempDir = Join-Path $CacheRoot "temp"
$LogsDir = Join-Path $CacheRoot "logs"
$StateDir = Join-Path $CacheRoot "state"

# Ensure all cache directories exist
$dirs = @($FirebaseCliDir, $NpmCacheDir, $DownloadsDir, $TempDir, $LogsDir, $StateDir)
foreach ($d in $dirs) {
    if (!(Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# Configure isolated environment
$env:npm_config_cache = $NpmCacheDir
$env:TEMP = $TempDir
$env:TMP = $TempDir
$env:PATH = "$FirebaseCliDir\node_modules\.bin;" + $env:PATH

if ($CommandArgs -and $CommandArgs.Length -gt 0) {
    & $FirebaseBin @CommandArgs
} else {
    Write-Host "CodeVault Pro Firebase Environment Initialized." -ForegroundColor Cyan
    Write-Host "Firebase CLI : $FirebaseBin" -ForegroundColor White
    Write-Host "Project Root : $ProjectRoot" -ForegroundColor White
    Write-Host "Cache Root   : $CacheRoot" -ForegroundColor White
}
