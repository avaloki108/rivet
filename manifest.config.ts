import pkg from './package.json'

type Browser = 'chrome' | 'firefox'

export const getManifest = ({
  dev,
  browser = 'chrome',
}: {
  dev?: boolean
  browser?: Browser
}) => {
  const isFirefox = browser === 'firefox'

  const manifest: any = {
    name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
    description: pkg.extension.description,
    version: pkg.version,
    manifest_version: 3,
    action: {
      default_icon: {
        '16': `icons/icon${dev ? '-dev' : ''}@16w.png`,
        '32': `icons/icon${dev ? '-dev' : ''}@32w.png`,
        '48': `icons/icon${dev ? '-dev' : ''}@48w.png`,
        '128': `icons/icon${dev ? '-dev' : ''}@128w.png`,
      },
      ...(isFirefox
        ? {
            default_popup: 'src/entries/iframe/index.html',
          }
        : {}),
    },
    background: isFirefox
      ? {
          scripts: ['src/entries/background/index.ts'],
        }
      : {
          service_worker: 'src/entries/background/index.ts',
        },
    content_scripts: [
      {
        matches: ['*://*/*'],
        js: ['src/entries/content/index.ts'],
        run_at: 'document_start',
        all_frames: true,
      },
    ],
    icons: {
      '16': `icons/icon${dev ? '-dev' : ''}@16w.png`,
      '32': `icons/icon${dev ? '-dev' : ''}@32w.png`,
      '48': `icons/icon${dev ? '-dev' : ''}@48w.png`,
      '128': `icons/icon${dev ? '-dev' : ''}@128w.png`,
    },
    permissions: [
      'activeTab',
      'contextMenus',
      'declarativeNetRequest',
      'scripting',
      'sidePanel',
      'storage',
      'tabs',
      'unlimitedStorage',
      'webRequest',
    ],
    host_permissions: ['*://*/*'],
    web_accessible_resources: [
      {
        resources: ['*.woff2'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['inpage.js'],
        matches: ['*://*/*'],
      },
    ],
    commands: {
      'toggle-theme': {
        suggested_key: 'Ctrl+Shift+Y' as any,
        description: 'Toggle Theme',
      },
    },
  }

  // Add side_panel only for Chrome
  if (!isFirefox) {
    manifest.side_panel = {
      default_path: 'src/entries/iframe/index.html',
    }
  }

  // Filter out sidePanel permission for Firefox
  if (isFirefox) {
    manifest.permissions = manifest.permissions.filter(
      (p: string) => p !== 'sidePanel',
    )
  }

  return manifest as chrome.runtime.Manifest
}
