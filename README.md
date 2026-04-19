# Desmos Text Input/Output Tool

A browser extension for importing and exporting Desmos graphs as JSON text.

## Features

- **Export Graphs**: Save any Desmos graph as JSON text for backup or sharing
- **Import Graphs**: Load JSON data back into Desmos to recreate graphs
- **Cross-Browser**: Works on both Chrome and Firefox
- **Simple Interface**: Easy-to-use popup interface

## Installation

### Firefox
1. Install from [Firefox Add-ons]([https://addons.mozilla.org/](https://addons.mozilla.org/en-US/firefox/addon/desmos-text-input-output)
2. Or load as temporary add-on for development:
   - Download the latest release from the [releases page](https://github.com/yourusername/desmos-text-io/releases)
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox" → "Load Temporary Add-on"
   - Select the `manifest.json` file from the downloaded extension

### Chrome
1. Download the extension from the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Or load as unpacked extension for development:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to [Desmos](https://www.desmos.com/calculator)
2. Click the Desmos Text I/O extension icon in your browser toolbar
3. **To Export**:
   - Click the "Export" button
   - The graph's JSON data will be copied to your clipboard
4. **To Import**:
   - Paste your JSON data into the text area
   - Click the "Import" button
   - The graph will be loaded into Desmos

## Development

This extension is built with:
- Manifest V3
- Content scripts for Desmos integration
- Popup interface for user interaction

### File Structure
- `manifest.json` - Extension manifest
- `popup.html/css/js` - Extension popup interface
- `content.bundle.js` - Content script for Desmos pages
- `injected.js` - Script injected into Desmos
- `ace.bundle.js` - Ace editor for JSON editing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#

Made with ❤️ by [jedbillyb](https://github.com/jedbillyb)
