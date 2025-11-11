# Install FFmpeg Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FFmpeg Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create temp directory
$tempDir = "$env:TEMP\ffmpeg-install"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

# Download FFmpeg
Write-Host "[1/5] Downloading FFmpeg..." -ForegroundColor Yellow
$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$zipFile = "$tempDir\ffmpeg.zip"

try {
    # Download with progress
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "      Download complete!" -ForegroundColor Green
} catch {
    Write-Host "      Error downloading FFmpeg!" -ForegroundColor Red
    Write-Host "      Please download manually from: https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor Yellow
    exit 1
}

# Extract FFmpeg
Write-Host "[2/5] Extracting FFmpeg..." -ForegroundColor Yellow
$extractDir = "$tempDir\extracted"
try {
    Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force
    Write-Host "      Extraction complete!" -ForegroundColor Green
} catch {
    Write-Host "      Error extracting FFmpeg!" -ForegroundColor Red
    exit 1
}

# Find ffmpeg folder
$ffmpegFolder = Get-ChildItem -Path $extractDir -Directory | Select-Object -First 1

# Create C:\ffmpeg directory
Write-Host "[3/5] Installing to C:\ffmpeg..." -ForegroundColor Yellow
$installDir = "C:\ffmpeg"
if (Test-Path $installDir) {
    Write-Host "      Removing old installation..." -ForegroundColor Yellow
    Remove-Item -Path $installDir -Recurse -Force
}

try {
    Copy-Item -Path $ffmpegFolder.FullName -Destination $installDir -Recurse -Force
    Write-Host "      Installation complete!" -ForegroundColor Green
} catch {
    Write-Host "      Error: Need administrator rights!" -ForegroundColor Red
    Write-Host "      Please run PowerShell as Administrator" -ForegroundColor Yellow
    exit 1
}

# Add to PATH
Write-Host "[4/5] Adding to PATH..." -ForegroundColor Yellow
$ffmpegBin = "$installDir\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($currentPath -notlike "*$ffmpegBin*") {
    try {
        $newPath = "$currentPath;$ffmpegBin"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "      Added to PATH!" -ForegroundColor Green
    } catch {
        Write-Host "      Error: Need administrator rights to modify PATH!" -ForegroundColor Red
        Write-Host "      Please add manually: $ffmpegBin" -ForegroundColor Yellow
    }
} else {
    Write-Host "      Already in PATH!" -ForegroundColor Green
}

# Update current session PATH
$env:Path = "$env:Path;$ffmpegBin"

# Cleanup
Write-Host "[5/5] Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force
Write-Host "      Cleanup complete!" -ForegroundColor Green

# Test FFmpeg
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing FFmpeg Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $ffmpegVersion = & "$ffmpegBin\ffmpeg.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "✅ FFmpeg installed successfully!" -ForegroundColor Green
    Write-Host "   $ffmpegVersion" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Location: $installDir" -ForegroundColor Gray
    Write-Host "Binary: $ffmpegBin\ffmpeg.exe" -ForegroundColor Gray
} catch {
    Write-Host "❌ FFmpeg test failed!" -ForegroundColor Red
    Write-Host "   Please restart your terminal and try: ffmpeg -version" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Close ALL terminals and VSCode" -ForegroundColor Yellow
Write-Host "2. Open new terminal" -ForegroundColor Yellow
Write-Host "3. Test: ffmpeg -version" -ForegroundColor Yellow
Write-Host "4. Restart backend: cd backend && npm run dev" -ForegroundColor Yellow
Write-Host "5. Re-upload video" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
