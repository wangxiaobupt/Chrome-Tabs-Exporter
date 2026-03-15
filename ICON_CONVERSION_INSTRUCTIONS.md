# Icon Conversion Instructions

The Chrome Tabs Manager extension requires PNG icons instead of SVG files for better compatibility.

## Current SVG Files
- `icon16.svg` (16x16 pixels)
- `icon48.svg` (48x48 pixels) 
- `icon128.svg` (128x128 pixels)

## Required PNG Files
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## Conversion Methods

### Method 1: Online Converter
1. Visit https://convertio.co/svg-png/ or similar online converter
2. Upload each SVG file
3. Convert to PNG with the same dimensions
4. Download and save in the project root

### Method 2: Using Inkscape (Command Line)
```bash
# Install Inkscape if not already installed
# macOS: brew install inkscape
# Ubuntu: sudo apt install inkscape

# Convert each icon
inkscape --export-type=png --export-width=16 --export-height=16 icon16.svg -o icon16.png
inkscape --export-type=png --export-width=48 --export-height=48 icon48.svg -o icon48.png
inkscape --export-type=png --export-width=128 --export-height=128 icon128.svg -o icon128.png
```

### Method 3: Using ImageMagick
```bash
# Install ImageMagick if not already installed
# macOS: brew install imagemagick
# Ubuntu: sudo apt install imagemagick

# Convert each icon
convert icon16.svg -resize 16x16 icon16.png
convert icon48.svg -resize 48x48 icon48.png
convert icon128.svg -resize 128x128 icon128.png
```

## After Conversion
1. Delete the SVG files (optional)
2. Verify the PNG files are in the project root
3. Test the extension in Chrome

The manifest.json has already been updated to reference the PNG files.