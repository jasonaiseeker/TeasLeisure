param(
    [string]$EnvFile = (Join-Path $PSScriptRoot '..\.env')
)

$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile -ErrorAction Stop).Path
$loadedCount = 0
foreach ($line in Get-Content -LiteralPath $resolvedEnvFile) {
    $trimmedLine = $line.Trim()
    if (-not $trimmedLine -or $trimmedLine.StartsWith('#')) { continue }
    if ($trimmedLine.StartsWith('export ')) { $trimmedLine = $trimmedLine.Substring(7).Trim() }
    $separator = $trimmedLine.IndexOf('=')
    if ($separator -lt 1) { continue }

    $name = $trimmedLine.Substring(0, $separator).Trim()
    if ($name -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') { continue }
    $value = $trimmedLine.Substring($separator + 1).Trim()
    if ($value.Length -ge 2) {
        $first = $value[0]
        $last = $value[$value.Length - 1]
        if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
            $value = $value.Substring(1, $value.Length - 2)
        }
    }
    [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    $loadedCount++
}

Write-Host "Loaded $loadedCount environment settings into this PowerShell process. Values are hidden."
