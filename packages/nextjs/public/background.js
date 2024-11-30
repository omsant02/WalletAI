// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Scaffold Stark installed');
  });
  
  // Listen for messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    sendResponse({ received: true });
    return true; // Will respond asynchronously
  });