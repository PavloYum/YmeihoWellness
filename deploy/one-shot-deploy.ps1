param(
    [Parameter(Mandatory = $true)]
    [string]$TargetHost,

    [string]$User = "pi",
    [int]$Port = 22,
    [string]$RemoteDir = "/opt/yumeiho-wellness",
    [string]$EnvFile = ".env.pi",
    [string]$IdentityFile = "",
    [switch]$SkipBuild,
    [switch]$InstallDocker
)

$ErrorActionPreference = "Stop"

function Require-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Resolve-ProjectFile {
    param(
        [string]$ProjectRoot,
        [string]$PathValue
    )

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return (Resolve-Path $PathValue).Path
    }

    return (Resolve-Path (Join-Path $ProjectRoot $PathValue)).Path
}

Write-Host "Validating local prerequisites..."
Require-Command "ssh"
Require-Command "scp"
Require-Command "tar"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$EnvPath = Resolve-ProjectFile -ProjectRoot $ProjectRoot -PathValue $EnvFile
if (-not (Test-Path $EnvPath)) {
    throw "Env file '$EnvFile' not found. Create it first (example: Copy-Item .env.pi.example .env.pi)."
}

if (-not (Test-Path (Join-Path $ProjectRoot "docker-compose.pi.yml"))) {
    throw "docker-compose.pi.yml not found in $ProjectRoot."
}

$DeployScriptPath = Join-Path $ScriptDir "remote-deploy.sh"
if (-not (Test-Path $DeployScriptPath)) {
    throw "remote-deploy.sh not found in $ScriptDir."
}

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ArchiveLocal = Join-Path $env:TEMP "yumeiho-deploy-$Stamp.tar.gz"
$RemoteArchive = "/tmp/yumeiho-deploy-$Stamp.tar.gz"
$RemoteEnv = "/tmp/yumeiho-env-$Stamp"
$RemoteDeployScript = "/tmp/yumeiho-remote-deploy-$Stamp.sh"
$EffectiveUser = $User
$EffectiveHost = $TargetHost
if ($TargetHost -match "^(?<u>[^@]+)@(?<h>.+)$") {
    if ($User -eq "pi") {
        $EffectiveUser = $Matches["u"]
    }
    $EffectiveHost = $Matches["h"]
}
$EffectiveHost = $EffectiveHost.Trim("[", "]")
$SshRemoteTarget = "$EffectiveUser@$EffectiveHost"
$ScpHost = if ($EffectiveHost.Contains(":")) { "[$EffectiveHost]" } else { $EffectiveHost }
$ScpRemoteTarget = "$EffectiveUser@$ScpHost"
$IdentityArgs = @()
if ($IdentityFile) {
    $IdentityArgs = @("-i", (Resolve-ProjectFile -ProjectRoot $ProjectRoot -PathValue $IdentityFile))
}
$SkipBuildInt = if ($SkipBuild) { 1 } else { 0 }
$InstallDockerInt = if ($InstallDocker) { 1 } else { 0 }

Write-Host "Packaging project from $ProjectRoot ..."
Push-Location $ProjectRoot
try {
    & tar `
        --exclude=".git" `
        --exclude=".vscode" `
        --exclude="target" `
        --exclude=".env" `
        --exclude=".env.pi" `
        --exclude="data" `
        --exclude="*.log" `
        -czf $ArchiveLocal .
} finally {
    Pop-Location
}

if (-not (Test-Path $ArchiveLocal)) {
    throw "Failed to create archive: $ArchiveLocal"
}

Write-Host "Uploading bundle to $SshRemoteTarget ..."
& scp @IdentityArgs -P $Port $ArchiveLocal "$ScpRemoteTarget`:$RemoteArchive"
& scp @IdentityArgs -P $Port $EnvPath "$ScpRemoteTarget`:$RemoteEnv"
& scp @IdentityArgs -P $Port $DeployScriptPath "$ScpRemoteTarget`:$RemoteDeployScript"

Write-Host "Running remote deploy commands..."
$RemoteCommand = "REMOTE_DIR='$RemoteDir' REMOTE_ARCHIVE='$RemoteArchive' REMOTE_ENV='$RemoteEnv' SKIP_BUILD='$SkipBuildInt' INSTALL_DOCKER='$InstallDockerInt' bash '$RemoteDeployScript'"
try {
    & ssh @IdentityArgs -p $Port $SshRemoteTarget $RemoteCommand
} finally {
    if (Test-Path $ArchiveLocal) {
        Remove-Item $ArchiveLocal -Force
    }
}

Write-Host "Deployment completed."
