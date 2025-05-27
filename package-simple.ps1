# Gmail AI Chrome扩展简化打包脚本

Write-Host "开始打包Gmail AI Chrome扩展..." -ForegroundColor Green

# 检查manifest.json
if (-not (Test-Path "manifest.json")) {
    Write-Host "错误: 未找到manifest.json文件" -ForegroundColor Red
    exit 1
}

# 读取版本号
$manifest = Get-Content "manifest.json" | ConvertFrom-Json
$version = $manifest.version
Write-Host "当前版本: $version" -ForegroundColor Yellow

# 创建打包目录
$packageDir = "gmail-ai-extension"
if (Test-Path $packageDir) {
    Remove-Item $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null

# 复制必需文件
Write-Host "复制文件..." -ForegroundColor Yellow
Copy-Item "manifest.json" "$packageDir/"
Copy-Item "background.js" "$packageDir/"
Copy-Item "content.js" "$packageDir/"

# 复制文件夹
$folders = @("icons", "utils", "styles", "options", "popup")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Copy-Item $folder "$packageDir/" -Recurse
        Write-Host "复制: $folder/" -ForegroundColor Green
    }
}

# 创建ZIP文件
$zipName = "gmail-ai-v$version.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

Compress-Archive -Path "$packageDir\*" -DestinationPath $zipName -Force

# 获取文件大小
$zipSize = (Get-Item $zipName).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)

Write-Host "打包完成!" -ForegroundColor Green
Write-Host "文件名: $zipName" -ForegroundColor Cyan
Write-Host "文件大小: $zipSizeMB MB" -ForegroundColor Cyan

# 清理临时目录
Remove-Item $packageDir -Recurse -Force

Write-Host "现在可以上传到Chrome应用商店了!" -ForegroundColor Green 