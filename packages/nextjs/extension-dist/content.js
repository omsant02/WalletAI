// Announce presence
console.log('Scaffold Stark content script loaded');

// Listen for messages from the page
window.addEventListener('message', (event) => {
  // Only accept messages from our window
  if (event.source !== window) return;

  if (event.data.type && event.data.type === 'SCAFFOLD_STARK_REQUEST') {
    chrome.runtime.sendMessage(event.data, (response) => {
      window.postMessage({
        type: 'SCAFFOLD_STARK_RESPONSE',
        response
      }, '*');
    });
  }
});

// Create a separate script file for injection
const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(injectScript);