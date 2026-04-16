$root= "myPWAproject"

$dirs = @(

    # Public Folders #
    "$root/public",
    "$root/public/assets",
    "$root/public/assets/images",
    "$root/public/assets/styles",


    # Source Folders #
    "$root/src",
    "$root/src/pages",
    "$root/src/scripts",
    "$root/src/services",
    "$root/src/database",
    "$root/src/server",
    "$root/src/fonts"


)

foreach($d in $dirs){
    New-Item -ItemType Directory -Path $d -Force
}

New-Item -ItemType File -Path "$root/public/index.html" -Force
New-Item -ItemType File -Path "$root/public/manifest.json" -Force
New-Item -ItemType File -Path "$root/public/serviceWorker.py" -Force
