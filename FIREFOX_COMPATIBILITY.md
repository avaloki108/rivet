# Firefox Compatibility Implementation

This document describes the changes made to make Rivet compatible with Firefox.

## Key Differences Between Chrome and Firefox

### 1. Manifest V3 Support
- **Chrome**: Full MV3 support with service workers
- **Firefox**: Limited MV3 support, requires background scripts/pages

### 2. Content Script Injection
- **Chrome**: Supports `world: 'MAIN'` parameter for isolated script injection
- **Firefox**: Does not support `world` parameter, requires manual script injection

### 3. Side Panel API
- **Chrome**: Has native `chrome.sidePanel` API
- **Firefox**: Does not support side panel, uses action popup instead

## Implementation Changes

### 1. Browser Detection (`src/utils/browser.ts`)
Created utility functions to detect browser type:
- `isFirefox()`: Checks if running in Firefox
- `isChrome()`: Checks if running in Chrome
- `getBrowserAPI()`: Returns the appropriate browser API object

### 2. Manifest Configuration (`manifest.config.ts`)
Updated to generate browser-specific manifests:
- Accepts `browser` parameter ('chrome' | 'firefox')
- For Firefox:
  - Uses `background.scripts` instead of `service_worker`
  - Adds `default_popup` to action
  - Removes `sidePanel` permission and configuration
- For Chrome:
  - Uses `service_worker` in background
  - Includes `side_panel` configuration
  - Includes `sidePanel` permission

### 3. Inpage Script Injection (`src/entries/background/inpage.ts`)
- For Chrome: Uses `chrome.scripting.registerContentScripts` with `world: 'MAIN'`
- For Firefox: Skips registration (handled by content script instead)

### 4. Content Script (`src/entries/content/index.ts`)
Added Firefox-specific inpage script injection:
- Detects Firefox browser
- Manually injects `inpage.js` by creating a script element
- Appends to document and removes after load

### 5. Context Menu (`src/entries/background/context-menu.ts`)
- Checks for `chrome.sidePanel` availability
- Only sets panel behavior if sidePanel API exists (Chrome only)

### 6. Wallet Sidebar Handler (`src/entries/background/wallet-sidebar.ts`)
- For Firefox: Logs that popup is available (can't be opened programmatically)
- For Chrome: Opens side panel programmatically

### 7. Build Configuration (`vite.config.ts`)
- Reads `BROWSER` environment variable
- Outputs to browser-specific directories:
  - Chrome: `dist/build-chrome`
  - Firefox: `dist/build-firefox`

### 8. Package Scripts (`package.json`)
Added Firefox-specific build scripts:
- `build:firefox`: Build for Firefox
- `dev:firefox`: Development mode for Firefox
- `firefox`: Run Firefox with extension
- `zip:firefox`: Package Firefox extension

## Building for Firefox

```bash
# Build for Firefox
bun run build:firefox

# Development with Firefox
bun run dev:firefox

# Package Firefox extension
bun run zip:firefox
```

## Known Limitations in Firefox

1. **Side Panel**: Firefox users will see a popup when clicking the extension icon instead of a side panel.
2. **Programmatic Popup**: Firefox doesn't allow programmatically opening the popup, so users must click the icon manually.
3. **Temporary Installation**: Firefox requires signing for permanent installation. For development, extensions are temporary and removed on browser restart.

## Testing

The extension has been built successfully for both browsers. The manifests are correctly generated with browser-specific configurations. Manual testing in Firefox is recommended to ensure all functionality works as expected.
