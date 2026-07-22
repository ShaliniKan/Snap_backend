# Sync local MongoDB (Compass) -> MongoDB Atlas
# Run from PowerShell:  cd Backend\scripts  ;  .\sync-local-to-atlas.ps1

$ErrorActionPreference = "Stop"

$toolsBin = "C:\Program Files\MongoDB\Tools\100\bin"
$mongodump = Join-Path $toolsBin "mongodump.exe"
$mongorestore = Join-Path $toolsBin "mongorestore.exe"
$dumpDir = Join-Path $env:USERPROFILE "Desktop\apnamart-dump"
$localUri = "mongodb://127.0.0.1:27017/apnamart_db"

# Load ATLAS_URI from Backend\.env (line: ATLAS_URI=...)
$envFile = Join-Path $PSScriptRoot "..\.env"
$atlasUri = $null
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*ATLAS_URI=(.+)$') {
            $atlasUri = $matches[1].Trim()
        }
    }
}

if (-not (Test-Path $mongodump)) {
    Write-Error "mongodump not found at $mongodump. Install MongoDB Database Tools."
}

if (-not $atlasUri) {
    Write-Error "ATLAS_URI not found in Backend\.env. Add: ATLAS_URI=mongodb+srv://user:pass@cluster/apnamart_db"
}

Write-Host "Step 1/2: Exporting local database..."
& $mongodump --uri=$localUri --out=$dumpDir
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Step 2/2: Restoring to Atlas (--drop replaces existing Atlas data)..."
& $mongorestore --uri=$atlasUri --drop (Join-Path $dumpDir "apnamart_db")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Local data copied to Atlas."
Write-Host "Test Atlas in Compass with ATLAS_URI, then restart EC2: pm2 restart apnamart-api --update-env"
