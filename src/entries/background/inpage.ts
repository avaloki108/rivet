function isFirefox(): boolean {
  return (
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox')
  )
}

export function setupInpage() {
  // Firefox doesn't support the 'world' parameter yet
  // For Firefox, we'll inject via content script instead
  if (isFirefox()) {
    // Skip dynamic registration for Firefox, will be handled via content script
    return
  }

  // Chrome/Chromium supports world: MAIN for isolated injection
  chrome.scripting.registerContentScripts([
    {
      id: 'inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['inpage.js'],
      runAt: 'document_start',
      world: 'MAIN',
    },
  ])
}
