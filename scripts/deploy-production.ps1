Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$productName = 'Desktop App Starter'
$desktopShortcutPath = Join-Path $env:USERPROFILE 'Desktop\Desktop App Starter.lnk'
$installedExePath = Join-Path $env:LOCALAPPDATA 'Desktop App Starter\Desktop App Starter.exe'

function Require-Command {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $Name"
  }
}

function New-DesktopShortcut {
  param(
    [string]$TargetPath,
    [string]$ShortcutPath,
    [string]$WorkingDirectory
  )

  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($ShortcutPath)
  $shortcut.TargetPath = $TargetPath
  $shortcut.WorkingDirectory = $WorkingDirectory
  $shortcut.IconLocation = $TargetPath
  $shortcut.Save()
}

Require-Command 'npm'

Push-Location $projectRoot
try {
  if (-not (Test-Path (Join-Path $projectRoot 'node_modules'))) {
    Write-Host 'Installing dependencies...'
    npm install
  }

  Write-Host 'Building production installers...'
  npm run make

  $setupExe = Get-ChildItem -Path (Join-Path $projectRoot 'out\make\squirrel.windows') -Filter '*Setup.exe' -Recurse |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

  if (-not $setupExe) {
    throw 'Windows installer was not found under out\make\squirrel.windows.'
  }

  Write-Host "Running installer: $($setupExe.FullName)"
  $installer = Start-Process -FilePath $setupExe.FullName -Wait -PassThru

  if ($installer.ExitCode -ne 0) {
    throw "Installer failed with exit code $($installer.ExitCode)."
  }

  if (-not (Test-Path $installedExePath)) {
    throw "Installed app was not found at $installedExePath"
  }

  New-DesktopShortcut -TargetPath $installedExePath -ShortcutPath $desktopShortcutPath -WorkingDirectory (Split-Path $installedExePath -Parent)

  Write-Host ''
  Write-Host 'Production build and install completed.'
  Write-Host "Installed app: $installedExePath"
  Write-Host "Desktop shortcut: $desktopShortcutPath"
}
finally {
  Pop-Location
}