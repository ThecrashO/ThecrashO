# Powershell fallback:  .\scripts\generate-blog-manifest.ps1
$paperDir = Join-Path $PSScriptRoot "..\paper"
$outFile = Join-Path $PSScriptRoot "..\data\paper.json"

function Parse-Frontmatter($content) {
    if ($content -notmatch '(?s)^---\r?\n(.*?)\r?\n---') { return @{} }
    $meta = @{}
    foreach ($line in $Matches[1] -split "`n") {
        $idx = $line.IndexOf(':')
        if ($idx -gt 0) {
            $meta[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
        }
    }
    return $meta
}

function Format-Meta($date, $readTime) {
    $parsed = [datetime]::MinValue
    if ([datetime]::TryParse($date, [ref]$parsed)) {
        $label = $parsed.ToString("MMMM yyyy")
    } else {
        $label = $date
    }
    if ($readTime) { return "$label · $readTime" }
    return $label
}

$posts = Get-ChildItem $paperDir -Filter "*.md" | ForEach-Object {
    $id = $_.BaseName
    $raw = Get-Content $_.FullName -Raw
    $meta = Parse-Frontmatter $raw
    [ordered]@{
        id = $id
        tag = if ($meta.tag) { $meta.tag } else { "Blog" }
        title = if ($meta.title) { $meta.title } else { $id }
        desc = if ($meta.desc) { $meta.desc } else { "" }
        date = if ($meta.date) { $meta.date } else { "1970-01-01" }
        readTime = if ($meta.readTime) { $meta.readTime } else { "" }
        meta = Format-Meta $meta.date $meta.readTime
        image = if ($meta.image) { $meta.image } else { "" }
    }
} | Sort-Object { [datetime]$_.date } -Descending

$json = $posts | ConvertTo-Json -Depth 4
$null = New-Item -ItemType Directory -Force -Path (Split-Path $outFile)
Set-Content -Path $outFile -Value $json -Encoding UTF8
Write-Host "Wrote $($posts.Count) post(s) to data/paper.json"
