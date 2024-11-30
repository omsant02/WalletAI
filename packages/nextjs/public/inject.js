window.scaffoldStark = {
    isInstalled: true,
    version: '1.0.0',
    request: async function(params) {
      return new Promise((resolve, reject) => {
        window.postMessage({
          type: 'SCAFFOLD_STARK_REQUEST',
          params
        }, '*');
  
        window.addEventListener('SCAFFOLD_STARK_RESPONSE', function handler(event) {
          window.removeEventListener('SCAFFOLD_STARK_RESPONSE', handler);
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data.response);
          }
        });
      });
    }
  };