# push-to-github.ps1
# Run this from the repo folder to commit and push the Delin Xie redesign.
# If VS Code or another tool holds the git lock, this removes it first.

Set-Location $PSScriptRoot

# Remove stale lock if present
$lock = ".git\index.lock"
if (Test-Path $lock) {
    Remove-Item $lock -Force
    Write-Host "Removed stale git lock." -ForegroundColor Yellow
}

# Commit (files are already staged)
git commit -m "Redesign site for Delin Xie

- New CSS design system: deep navy/gold/off-white, Lora + Inter
- Home: large display hero, thin gold rule, editorial lane rows
- About: hairline credential grid, clean bio layout
- Consulting: column-divided services, large-numeral process steps
- Speaking: 2x2 topic grid, two-column abstracts, format columns
- Writing: article card grid with navy covers
- Contact: refined intake form
- All pages: Peter Zhang content removed, Delin Xie wordmark
- CNAME: cleared old peterczhang.com domain"

# Push
git push origin main

Write-Host ""
Write-Host "Done. Site will be live at:" -ForegroundColor Green
Write-Host "  https://changnister.github.io/delinxie/" -ForegroundColor Cyan
Write-Host ""
Write-Host "To use a custom domain, go to:" -ForegroundColor Gray
Write-Host "  github.com/Changnister/delinxie > Settings > Pages > Custom domain" -ForegroundColor Gray

Read-Host "Press Enter to close"
