# KIANSANTANG - Start All Applications
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KIANSANTANG - Start All Apps" -ForegroundColor Yellow
Write-Host "  Kios Antrian Santun dan Tanggap" -ForegroundColor White
Write-Host "  BAPAS Kelas I Bandung" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to start app in new window
function Start-App {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Port
    )
    
    Write-Host "[Starting] $Name (Port $Port)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; npm run dev"
    Start-Sleep -Seconds 2
}

# Start Backend API
Start-App -Name "Backend API" -Path "$PSScriptRoot\backend" -Port "3000"
Start-Sleep -Seconds 3

# Start Pengguna Layanan
Start-App -Name "Pengguna Layanan" -Path "$PSScriptRoot\registration-app" -Port "5173"

# Start Panel Admin
Start-App -Name "Panel Admin" -Path "$PSScriptRoot\operator-app" -Port "5174"

# Start Display
Start-App -Name "Display" -Path "$PSScriptRoot\display-app" -Port "5175"

# Start Petugas
Start-App -Name "Petugas" -Path "$PSScriptRoot\petugas-app" -Port "5176"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All Applications Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Yellow
Write-Host "  - Backend API:       http://localhost:3000" -ForegroundColor White
Write-Host "  - Pengguna Layanan:  http://localhost:5173" -ForegroundColor White
Write-Host "  - Panel Admin:       http://localhost:5174" -ForegroundColor White
Write-Host "  - Display:           http://localhost:5175" -ForegroundColor White
Write-Host "  - Petugas:           http://localhost:5176" -ForegroundColor White
Write-Host ""
Write-Host "Home Dashboard: index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tip: Buka index.html di browser untuk akses semua aplikasi" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
