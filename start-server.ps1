# PowerShell script to start the PWA server
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting Dreamland Play Cafe PWA Server..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$pythonExists = Get-Command python -ErrorAction SilentlyContinue
if ($pythonExists) {
    Write-Host "Starting Python server..." -ForegroundColor Yellow
    Write-Host "The server will open in your default browser automatically." -ForegroundColor Yellow
    Write-Host ""
    python server.py
} else {
    # Try Node.js if Python is not available
    $nodeExists = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExists) {
        Write-Host "Python not found. Starting Node.js server..." -ForegroundColor Yellow
        node server.js
    } else {
        Write-Host "Neither Python nor Node.js found!" -ForegroundColor Red
        Write-Host "Please install Python or Node.js to run the server." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")