import { getMessenger } from '~/messengers'
import { setupBridgeTransportRelay } from '~/messengers/transports/bridge'

setupBridgeTransportRelay()

const backgroundMessenger = getMessenger('background:contentScript')
backgroundMessenger.send('ping', undefined)
setInterval(() => {
  backgroundMessenger.send('ping', undefined)
}, 5000)

window.addEventListener('message', ({ data }) => {
  if (data.type === 'openWallet') chrome.runtime.sendMessage(data)
})

// Firefox doesn't support world: MAIN, so we inject inpage script manually
function isFirefox(): boolean {
  return (
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox')
  )
}

if (isFirefox()) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('inpage.js')
  script.type = 'module'
  ;(document.head || document.documentElement).appendChild(script)
  script.onload = () => script.remove()
}
