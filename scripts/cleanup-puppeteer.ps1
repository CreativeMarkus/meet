# Cleanup script for Puppeteer temporary directories on Windows
# This fixes the "browser is already running" error

Write-Host "Cleaning up Puppeteer temporary directories..." -ForegroundColor Yellow

# Kill any lingering Chrome processes
taskkill /F /IM chrome.exe /T 2>$null | Out-Null
taskkill /F /IM msedge.exe /T 2>$null | Out-Null

# Remove Puppeteer temp directories
Remove-Item -Path "$env:TEMP\puppeteer_dev_chrome_profile-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\puppeteer_profile_*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup complete!" -ForegroundColor Green
