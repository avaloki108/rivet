import { settingsStore } from '../../zustand'

function isFirefox(): boolean {
  return (
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox')
  )
}

export function setupWalletSidebarHandler() {
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'openWallet') {
      const { bypassSignatureAuth, bypassTransactionAuth } =
        settingsStore.getState()
      const { method } = message.payload
      if (
        method === 'eth_requestAccounts' ||
        method === 'wallet_showCallsStatus' ||
        (method === 'eth_sendTransaction' && !bypassTransactionAuth) ||
        (method === 'eth_sign' && !bypassSignatureAuth) ||
        (method === 'eth_signTypedData_v4' && !bypassSignatureAuth) ||
        (method === 'personal_sign' && !bypassSignatureAuth) ||
        (method === 'wallet_sendCalls' && !bypassTransactionAuth)
      ) {
        // Firefox doesn't support sidePanel, use action popup instead
        if (isFirefox() || !chrome.sidePanel) {
          // For Firefox, the popup is already configured in manifest
          // We can't programmatically open it, but it's available on click
          console.log('Wallet popup available via action button')
        } else {
          chrome.sidePanel.open({ tabId: sender.tab!.id! })
        }
      }
    }
  })
}
