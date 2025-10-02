export function isFirefox(): boolean {
  return (
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox')
  )
}

export function isChrome(): boolean {
  return (
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Chrome')
  )
}

export function getBrowserAPI() {
  // Firefox uses 'browser' namespace, Chrome uses 'chrome'
  if (typeof (globalThis as any).browser !== 'undefined') {
    return (globalThis as any).browser
  }
  if (typeof chrome !== 'undefined') {
    return chrome
  }
  return undefined
}
