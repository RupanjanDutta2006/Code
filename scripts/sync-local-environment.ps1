<#
.SYNOPSIS
    CodeVault Pro - Safe Local Environment Sync Script (Post-GitHub Desktop Pull)
.DESCRIPTION
    Runs AFTER pulling updates from GitHub Desktop.
    - Inspects dependency manifests (package.json, requirements.txt, lockfiles).
    - Compares SHA-256 fingerprints against local state in Cache\state\dependency-state.json.
    - Updates only modified dependency layers into the isolated Cache directory.
    - Reuses existing Node & Python virtual environments when unchanged.
    - Runs safe build and verification suite.
    - Generates a post-update summary report.
.PARAMETER SkipBuild
    Skip the frontend production build step.
.PARAMETER SkipTests
    Skip the automated test suite.
#>

param(
    [switch]$SkipBuild,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

# 1. Dynamically Detect Project & Cache Roots
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Search upwards for the directory containing 'Cache' or 'Code'
$CurrentSearch = $ScriptDir
$ProjectRoot = $null

for ($i = 0; $i -lt 5; $i++) {
    if (Test-Path "$CurrentSearch\Cache") {
        $ProjectRoot = (Resolve-Path $CurrentSearch).Path
        break
    } elseif ((Test-Path "$CurrentSearch\Code") -and (Test-Path "$CurrentSearch\start-codevault-env.ps1")) {
        $ProjectRoot = (Resolve-Path $CurrentSearch).Path
        break
    }
    $Parent = Split-Path -Parent $CurrentSearch
    if (!$Parent -or $Parent -eq $CurrentSearch) { break }
    $CurrentSearch = $Parent
}

if (!$ProjectRoot) {
    if (Test-Path "D:\My Created Projects\Code Vault Pro") {
        $ProjectRoot = "D:\My Created Projects\Code Vault Pro"
    } else {
        $ProjectRoot = (Get-Location).Path
    }
}

$CacheRoot = Join-Path $ProjectRoot "Cache"

if (Test-Path "$ProjectRoot\Code\package.json") {
    $CodeRoot = Join-Path $ProjectRoot "Code"
} else {
    $CodeRoot = $ProjectRoot
}

$StateDir = Join-Path $CacheRoot "state"
$StateFile = Join-Path $StateDir "dependency-state.json"
$ManifestFile = Join-Path $StateDir "cache-manifest.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CodeVault Pro -- Local Environment Synchronization       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Project Root : $ProjectRoot" -ForegroundColor White
Write-Host "Source Root  : $CodeRoot" -ForegroundColor White
Write-Host "Cache Root   : $CacheRoot" -ForegroundColor White
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

# 2. Ensure Cache Directory Structure Exists
$cacheDirs = @(
    "$CacheRoot\toolchains\node",
    "$CacheRoot\toolchains\python",
    "$CacheRoot\node\npm-cache",
    "$CacheRoot\node\npm-prefix",
    "$CacheRoot\node\temp",
    "$CacheRoot\python\pip-cache",
    "$CacheRoot\python\temp",
    "$CacheRoot\build",
    "$CacheRoot\temp",
    "$CacheRoot\logs",
    "$CacheRoot\downloads",
    "$StateDir"
)

foreach ($dir in $cacheDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 3. Configure Session Environment
$env:npm_config_cache  = "$CacheRoot\node\npm-cache"
$env:npm_config_prefix = "$CacheRoot\node\npm-prefix"
$env:PIP_CACHE_DIR     = "$CacheRoot\python\pip-cache"
$env:TEMP              = "$CacheRoot\temp"
$env:TMP               = "$CacheRoot\temp"

# 4. Load Previous Dependency State (PowerShell 5.1 & 7+ compatible)
$prevState = @{}
if (Test-Path $StateFile) {
    try {
        $rawJson = Get-Content -Path $StateFile -Raw | ConvertFrom-Json
        foreach ($prop in $rawJson.PSObject.Properties) {
            $prevState[$prop.Name] = $prop.Value
        }
    } catch {
        $prevState = @{}
    }
}

# 5. Calculate Current Manifest Hashes
$manifestFiles = @{
    "rootPackageJson"     = "$CodeRoot\package.json"
    "rootPackageLock"     = "$CodeRoot\package-lock.json"
    "frontendPackageJson" = "$CodeRoot\frontend\package.json"
    "frontendPackageLock" = "$CodeRoot\frontend\package-lock.json"
    "requirementsTxt"     = "$CodeRoot\requirements.txt"
}

$currentState = @{}
foreach ($key in $manifestFiles.Keys) {
    $path = $manifestFiles[$key]
    if (Test-Path $path) {
        $hash = (Get-FileHash -Path $path -Algorithm SHA256).Hash
        $currentState[$key] = $hash
    } else {
        $currentState[$key] = $null
    }
}

# 6. Detect Changes
$rootNodeModulesExists = Test-Path "$CodeRoot\node_modules"
$frontendNodeModulesExists = Test-Path "$CodeRoot\frontend\node_modules"
$pythonVenvExists = Test-Path "$CacheRoot\python\venv\Scripts\python.exe"

$rootNodeChanged = (!$rootNodeModulesExists) -or 
                   ($currentState["rootPackageJson"] -ne $prevState["rootPackageJson"]) -or 
                   ($currentState["rootPackageLock"] -ne $prevState["rootPackageLock"])

$frontendNodeChanged = (!$frontendNodeModulesExists) -or 
                       ($currentState["frontendPackageJson"] -ne $prevState["frontendPackageJson"]) -or 
                       ($currentState["frontendPackageLock"] -ne $prevState["frontendPackageLock"])

$pythonChanged = (!$pythonVenvExists) -or 
                 ($currentState["requirementsTxt"] -ne $prevState["requirementsTxt"])

Write-Host "`n[Dependency Status]" -ForegroundColor Yellow

$actionsSummary = @()
$envSummary = @{
    "Node"       = "Reused"
    "Python"     = "Reused"
    "PythonVenv" = if ($pythonVenvExists) { "Reused" } else { "Created" }
    "NpmCache"   = "Reused"
    "PipCache"   = "Reused"
}

# 7. Update Root Node Dependencies if needed
if ($rootNodeChanged) {
    Write-Host "  -> Root Node dependencies changed or missing. Installing..." -ForegroundColor Cyan
    Push-Location $CodeRoot
    try {
        npm install --cache "$CacheRoot\node\npm-cache"
        $actionsSummary += "Root npm packages synchronized"
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  -> Root Node dependencies: UNCHANGED (Reusing node_modules)" -ForegroundColor Green
}

# 8. Update Frontend Node Dependencies if needed
if ($frontendNodeChanged) {
    Write-Host "  -> Frontend Node dependencies changed or missing. Installing..." -ForegroundColor Cyan
    Push-Location $CodeRoot
    try {
        npm --prefix frontend install --cache "$CacheRoot\node\npm-cache" --fetch-retries 5
        $actionsSummary += "Frontend npm packages synchronized"
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  -> Frontend Node dependencies: UNCHANGED (Reusing frontend\node_modules)" -ForegroundColor Green
}

# 9. Update Python Virtual Environment & Packages if needed
if ($pythonChanged) {
    if (!$pythonVenvExists) {
        Write-Host "  -> Creating isolated Python virtual environment at $CacheRoot\python\venv..." -ForegroundColor Cyan
        python -m venv "$CacheRoot\python\venv"
        $envSummary["PythonVenv"] = "Created"
    }
    Write-Host "  -> Python dependencies changed. Synchronizing pip packages..." -ForegroundColor Cyan
    $venvPython = "$CacheRoot\python\venv\Scripts\python.exe"
    & "$venvPython" -m pip install -r "$CodeRoot\requirements.txt" --cache-dir "$CacheRoot\python\pip-cache"
    $actionsSummary += "Python requirements synchronized into Cache venv"
} else {
    Write-Host "  -> Python dependencies: UNCHANGED (Reusing Cache\python\venv)" -ForegroundColor Green
}

if ($actionsSummary.Count -eq 0) {
    $actionsSummary += "All dependency manifests unchanged. Reused existing local environment with zero package reinstalls."
}

# 10. Save Updated Dependency State
$currentState | ConvertTo-Json -Depth 4 | Set-Content -Path $StateFile -Encoding UTF8

# 11. Update Cache Manifest
$cacheManifest = [PSCustomObject]@{
    "ProjectRoot"     = $ProjectRoot
    "CacheRoot"       = $CacheRoot
    "LastSyncUtc"     = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    "NodePath"        = (Get-Command node -ErrorAction SilentlyContinue).Source
    "PythonVenvPath"  = "$CacheRoot\python\venv"
    "NpmCacheDir"     = "$CacheRoot\node\npm-cache"
    "PipCacheDir"     = "$CacheRoot\python\pip-cache"
    "DependencyState" = $currentState
}
$cacheManifest | ConvertTo-Json -Depth 4 | Set-Content -Path $ManifestFile -Encoding UTF8

# 12. Run Validation & Build Suite
$buildStatus = "NOT VERIFIED"
$backendTestStatus = "NOT VERIFIED"

if (!$SkipBuild) {
    Write-Host "`n[Running Frontend Build Validation...]" -ForegroundColor Yellow
    Push-Location $CodeRoot
    try {
        npm --prefix frontend run build
        if ($LASTEXITCODE -eq 0) {
            $buildStatus = "PASS"
            Write-Host "  [OK] Frontend production build succeeded." -ForegroundColor Green
        } else {
            $buildStatus = "FAIL"
            Write-Host "  [FAIL] Frontend build returned exit code $LASTEXITCODE" -ForegroundColor Red
        }
    } catch {
        $buildStatus = "FAIL"
        Write-Host "  [FAIL] Frontend build failed: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }
}

if (!$SkipTests) {
    # Backend tests
    Write-Host "`n[Running Backend Pytest Suite...]" -ForegroundColor Yellow
    $venvPython = "$CacheRoot\python\venv\Scripts\python.exe"
    if (Test-Path $venvPython) {
        Push-Location $CodeRoot
        try {
            & "$venvPython" -m pytest "backend/tests" -q
            if ($LASTEXITCODE -eq 0) {
                $backendTestStatus = "PASS"
                Write-Host "  [OK] Backend pytest suite passed." -ForegroundColor Green
            } else {
                $backendTestStatus = "FAIL"
                Write-Host "  [FAIL] Backend tests returned exit code $LASTEXITCODE" -ForegroundColor Red
            }
        } catch {
            $backendTestStatus = "FAIL"
        } finally {
            Pop-Location
        }
    }
}

# 13. Output Final Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "         POST-UPDATE SYNCHRONIZATION REPORT               " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Environment:" -ForegroundColor White
Write-Host "  Node         : $($envSummary['Node'])" -ForegroundColor Gray
Write-Host "  Python       : $($envSummary['Python'])" -ForegroundColor Gray
Write-Host "  Python venv  : $($envSummary['PythonVenv']) ($CacheRoot\python\venv)" -ForegroundColor Gray
Write-Host "  npm cache    : $($envSummary['NpmCache']) ($CacheRoot\node\npm-cache)" -ForegroundColor Gray
Write-Host "  pip cache    : $($envSummary['PipCache']) ($CacheRoot\python\pip-cache)" -ForegroundColor Gray
Write-Host "`nActions Performed:" -ForegroundColor White
foreach ($act in $actionsSummary) {
    Write-Host "  * $act" -ForegroundColor Gray
}
Write-Host "`nValidation Results:" -ForegroundColor White
Write-Host "  Frontend Build : $buildStatus" -ForegroundColor $(if ($buildStatus -eq "PASS") { "Green" } elseif ($buildStatus -eq "FAIL") { "Red" } else { "Yellow" })
Write-Host "  Backend Tests  : $backendTestStatus" -ForegroundColor $(if ($backendTestStatus -eq "PASS") { "Green" } elseif ($backendTestStatus -eq "FAIL") { "Red" } else { "Yellow" })
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "[Ready] CodeVault Pro local environment is fully synchronized." -ForegroundColor Green
