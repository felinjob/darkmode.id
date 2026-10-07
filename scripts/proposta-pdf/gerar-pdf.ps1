# Gera public/proposta-boutique-ne.pdf a partir de scripts/proposta-pdf/proposta.html
# Uso (na raiz do projeto):  powershell -ExecutionPolicy Bypass -File scripts/proposta-pdf/gerar-pdf.ps1

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$html = Join-Path $PSScriptRoot 'proposta.html'
$out  = Join-Path $root 'public\proposta-boutique-ne.pdf'

$candidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Edge ou Chrome nao encontrado.' }

$profileDir = Join-Path $env:TEMP 'proposta-pdf-profile'
$fileUrl = ([System.Uri]::new((Resolve-Path $html).Path)).AbsoluteUri

& $browser --headless=new --disable-gpu --no-pdf-header-footer `
  "--user-data-dir=$profileDir" `
  "--print-to-pdf=$out" `
  $fileUrl | Out-Null

# O processo headless pode retornar antes de gravar o arquivo
for ($i = 0; $i -lt 20 -and -not (Test-Path $out); $i++) { Start-Sleep -Milliseconds 500 }
if (-not (Test-Path $out)) { throw 'Falha ao gerar o PDF.' }

Write-Host ("PDF gerado: {0} ({1:N0} KB)" -f $out, ((Get-Item $out).Length / 1KB))
