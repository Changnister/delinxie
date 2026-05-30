#Requires -Version 5.0
param(
    [int]$Quality = 85,
    [int]$MinSizeKB = 50,
    [int]$ResizeLongEdge = 0,
    [switch]$DryRun = $false
)

$imagePath = "$PSScriptRoot\Images"
$backupPath = "$imagePath\backup"
$magickExe = "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"

Write-Host "`n=== IMAGE COMPRESSION UTILITY ===" -ForegroundColor Cyan
Write-Host "Quality: $Quality | Min Size: ${MinSizeKB}KB | Resize Long Edge: $ResizeLongEdge | Dry Run: $DryRun`n" -ForegroundColor Cyan

if (-not (Test-Path $magickExe)) {
    Write-Host "ERROR: ImageMagick not found at $magickExe" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -ErrorAction SilentlyContinue | Out-Null
    Write-Host "[OK] Created backup directory`n" -ForegroundColor Green
}

$files = @()
$files += @(Get-ChildItem -Path "$imagePath\*.jpg" -File -ErrorAction SilentlyContinue)
$files += @(Get-ChildItem -Path "$imagePath\*.jpeg" -File -ErrorAction SilentlyContinue)
$files += @(Get-ChildItem -Path "$imagePath\*.png" -File -ErrorAction SilentlyContinue)

if ($files.Count -eq 0) {
    Write-Host "No images found!" -ForegroundColor Red
    exit 1
}

$totalOriginal = ($files | Measure-Object -Property Length -Sum).Sum
Write-Host "Found $($files.Count) images | Total size: $([math]::Round($totalOriginal/1MB, 2)) MB`n" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$successCount = 0
$totalNew = 0

foreach ($file in $files) {
    $name = $file.Name
    $origSize = $file.Length
    $origSizeMB = [math]::Round($origSize/1MB, 2)
    $minBytes = $MinSizeKB * 1KB
    
    if ($origSize -lt $minBytes) {
        Write-Host "[SKIP] $name (${origSizeMB}MB)" -ForegroundColor Yellow
        $totalNew += $origSize
        continue
    }
    
    if ($DryRun) {
        Write-Host "[PREVIEW] $name (${origSizeMB}MB)" -ForegroundColor White
        $totalNew += $origSize
    } else {
        try {
            Copy-Item -Path $file.FullName -Destination "$backupPath\$name.bak" -Force | Out-Null
            
            if ($file.Extension -match "\.(jpg|jpeg)$") {
                $jpegArgs = @($file.FullName)
                if ($ResizeLongEdge -gt 0) {
                    $jpegArgs += "-resize"
                    $jpegArgs += "${ResizeLongEdge}x${ResizeLongEdge}>"
                }
                $jpegArgs += @("-quality", $Quality, "-strip", "-interlace", "Plane", $file.FullName)
                & $magickExe @jpegArgs | Out-Null
            } elseif ($file.Extension -match "\.png$") {
                $pngArgs = @($file.FullName)
                if ($ResizeLongEdge -gt 0) {
                    $pngArgs += "-resize"
                    $pngArgs += "${ResizeLongEdge}x${ResizeLongEdge}>"
                }
                $pngArgs += @("-quality", $Quality, "-strip", "-define", "png:compression-level=9", $file.FullName)
                & $magickExe @pngArgs | Out-Null
            }
            
            $newSize = (Get-Item $file.FullName).Length
            $newSizeMB = [math]::Round($newSize/1MB, 2)
            $reduction = [math]::Round((($origSize - $newSize) / $origSize) * 100, 1)
            
            Write-Host "[OK] $name : ${origSizeMB}MB -> ${newSizeMB}MB (-${reduction}%)" -ForegroundColor Green
            $totalNew += $newSize
            $successCount++
        } catch {
            Write-Host "[ERROR] $name : $_" -ForegroundColor Red
            $totalNew += $origSize
        }
    }
}

Write-Host "============================================================`n" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "[DRY RUN] Run without -DryRun to actually compress files.`n" -ForegroundColor Yellow
} else {
    $saved = $totalOriginal - $totalNew
    $percent = [math]::Round(($saved / $totalOriginal) * 100, 1)
    Write-Host "[COMPLETE] Compression finished!" -ForegroundColor Green
    Write-Host "Compressed: $successCount files" -ForegroundColor Green
    Write-Host "Original: $([math]::Round($totalOriginal/1MB, 2)) MB -> New: $([math]::Round($totalNew/1MB, 2)) MB" -ForegroundColor Green
    Write-Host "SAVED: $([math]::Round($saved/1MB, 2)) MB (${percent}% reduction)`n" -ForegroundColor Green
    Write-Host "Backups: $backupPath`n" -ForegroundColor White
}
