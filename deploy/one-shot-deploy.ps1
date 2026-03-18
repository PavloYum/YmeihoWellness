param(
    [Parameter(Mandatory = $true)]
    [string]$Host,

    [string]$User = "pi",
    [int]$Port = 22,
    [string]$RemoteDir = "/opt/yumeiho-wellness",
    [string]$EnvFile = ".env.pi",
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

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ArchiveLocal = Join-Path $env:TEMP "yumeiho-deploy-$Stamp.tar.gz"
$RemoteArchive = "/tmp/yumeiho-deploy-$Stamp.tar.gz"
$RemoteEnv = "/tmp/yumeiho-env-$Stamp"
$EffectiveUser = $User
$EffectiveHost = $Host
if ($Host -match "^(?<u>[^@]+)@(?<h>.+)$") {
    if ($User -eq "pi") {
        $EffectiveUser = $Matches["u"]
    }
    $EffectiveHost = $Matches["h"]
}
$EffectiveHost = $EffectiveHost.Trim("[", "]")
$SshRemoteTarget = "$EffectiveUser@$EffectiveHost"
$ScpHost = if ($EffectiveHost.Contains(":")) { "[$EffectiveHost]" } else { $EffectiveHost }
$ScpRemoteTarget = "$EffectiveUser@$ScpHost"
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
        --exclude="*.log" `
        -czf $ArchiveLocal .
} finally {
    Pop-Location
}

if (-not (Test-Path $ArchiveLocal)) {
    throw "Failed to create archive: $ArchiveLocal"
}

Write-Host "Uploading bundle to $SshRemoteTarget ..."
& scp -P $Port $ArchiveLocal "$ScpRemoteTarget`:$RemoteArchive"
& scp -P $Port $EnvPath "$ScpRemoteTarget`:$RemoteEnv"

$RemoteScript = @"
set -euo pipefail

REMOTE_DIR='$RemoteDir'
REMOTE_ARCHIVE='$RemoteArchive'
REMOTE_ENV='$RemoteEnv'
SKIP_BUILD='$SkipBuildInt'
INSTALL_DOCKER='$InstallDockerInt'

if [ "\$INSTALL_DOCKER" = "1" ] && ! command -v docker >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com | sudo sh
  else
    curl -fsSL https://get.docker.com | sh
  fi
fi

if docker info >/dev/null 2>&1; then
  DC='docker compose'
elif sudo -n docker info >/dev/null 2>&1; then
  DC='sudo docker compose'
else
  echo 'Docker daemon is not reachable for current user. Add user to docker group or use sudo.'
  exit 1
fi

mkdir -p "\$REMOTE_DIR"
if [ -f "\$REMOTE_DIR/docker-compose.pi.yml" ]; then
  \$DC -f "\$REMOTE_DIR/docker-compose.pi.yml" down --remove-orphans || true
fi
find "\$REMOTE_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -xzf "\$REMOTE_ARCHIVE" -C "\$REMOTE_DIR"
mv "\$REMOTE_ENV" "\$REMOTE_DIR/.env.pi"
rm -f "\$REMOTE_ARCHIVE"

cd "\$REMOTE_DIR"
if [ "\$SKIP_BUILD" = "1" ]; then
  \$DC -f docker-compose.pi.yml --env-file .env.pi up -d --remove-orphans
else
  \$DC -f docker-compose.pi.yml --env-file .env.pi up -d --build --remove-orphans
fi
\$DC -f docker-compose.pi.yml ps
"@

Write-Host "Running remote deploy commands..."
try {
    $RemoteScript | & ssh -p $Port $SshRemoteTarget "bash -s"
} finally {
    if (Test-Path $ArchiveLocal) {
        Remove-Item $ArchiveLocal -Force
    }
}

Write-Host "Deployment completed."