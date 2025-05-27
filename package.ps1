# Gmail AI Chrome扩展自动打包脚本
# 作者: Gmail AI Team
# 版本: 1.0.0

Write-Host "🚀 开始打包Gmail AI Chrome扩展..." -ForegroundColor Green

# 检查当前目录是否包含manifest.json
if (-not (Test-Path "manifest.json")) {
    Write-Host "❌ 错误: 未找到manifest.json文件，请确保在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 读取版本号
$manifest = Get-Content "manifest.json" | ConvertFrom-Json
$version = $manifest.version
Write-Host "📦 当前版本: $version" -ForegroundColor Yellow

# 创建打包目录
$packageDir = "gmail-ai-extension"
if (Test-Path $packageDir) {
    Write-Host "🗑️ 清理旧的打包目录..." -ForegroundColor Yellow
    Remove-Item $packageDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $packageDir | Out-Null
Write-Host "📁 创建打包目录: $packageDir" -ForegroundColor Green

# 复制必需文件
Write-Host "📋 复制必需文件..." -ForegroundColor Yellow

# 主要文件
$mainFiles = @("manifest.json", "background.js", "content.js")
foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Copy-Item $file "$packageDir/"
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ 缺少文件: $file" -ForegroundColor Red
    }
}

# 文件夹
$folders = @("icons", "utils", "styles", "options", "popup")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Copy-Item $folder "$packageDir/" -Recurse
        Write-Host "  ✅ $folder/" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ 可选文件夹不存在: $folder/" -ForegroundColor Yellow
    }
}

# 检查必需的图标文件
$iconSizes = @("16", "32", "48", "128")
$missingIcons = @()
foreach ($size in $iconSizes) {
    $iconPath = "icons/icon$size.png"
    if (-not (Test-Path $iconPath)) {
        $missingIcons += $iconPath
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host "⚠️ 警告: 缺少以下图标文件:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "  - $icon" -ForegroundColor Yellow
    }
}

# 创建ZIP文件
$zipName = "gmail-ai-v$version.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

Write-Host "🗜️ 创建ZIP文件: $zipName" -ForegroundColor Yellow
Compress-Archive -Path "$packageDir\*" -DestinationPath $zipName -Force

# 获取文件大小
$zipSize = (Get-Item $zipName).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)

Write-Host "✅ 打包完成!" -ForegroundColor Green
Write-Host "📦 文件名: $zipName" -ForegroundColor Cyan
Write-Host "📏 文件大小: $zipSizeMB MB" -ForegroundColor Cyan

# 检查文件大小
if ($zipSizeMB -gt 10) {
    Write-Host "⚠️ 警告: 文件大小超过10MB，可能影响上架" -ForegroundColor Yellow
}

# 显示打包内容
Write-Host "`n📋 打包内容清单:" -ForegroundColor Cyan
Get-ChildItem $packageDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Item $packageDir).FullName, "")
    if ($_.PSIsContainer) {
        Write-Host "  📁 $relativePath/" -ForegroundColor Blue
    } else {
        $fileSize = [math]::Round($_.Length / 1KB, 1)
        Write-Host "  📄 $relativePath ($fileSize KB)" -ForegroundColor White
    }
}

# 清理临时目录
Write-Host "`n🗑️ 清理临时文件..." -ForegroundColor Yellow
Remove-Item $packageDir -Recurse -Force

Write-Host "`n🎉 打包完成! 现在可以上传 $zipName 到Chrome应用商店" -ForegroundColor Green
Write-Host "📖 详细上架说明请查看: Chrome应用商店打包说明.md" -ForegroundColor Cyan

# 提示下一步操作
Write-Host "`n📋 下一步操作:" -ForegroundColor Yellow
Write-Host "1. 访问 https://chrome.google.com/webstore/devconsole/" -ForegroundColor White
Write-Host "2. 点击 '新增项目'" -ForegroundColor White
Write-Host "3. 上传 $zipName 文件" -ForegroundColor White
Write-Host "4. 填写扩展信息并提交审核" -ForegroundColor White

Write-Host "`n按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 