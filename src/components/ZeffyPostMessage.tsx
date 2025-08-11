'use client';

import { useEffect } from 'react';

export function ZeffyPostMessage() {
  useEffect(() => {
    // Listen for messages from Zeffy iframe
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Zeffy
      if (event.origin !== 'https://www.zeffy.com') return;
      
      console.log('Message from Zeffy:', event.data);
      
      // If Zeffy supports custom styling messages
      if (event.data.type === 'ZEFFY_READY') {
        // Send custom theme to iframe
        const iframe = document.querySelector('iframe[title*="Donation form"]') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'APPLY_CUSTOM_THEME',
            theme: {
              primaryColor: '#your-brand-color',
              backgroundColor: '#your-bg-color',
              fontFamily: 'your-font-family'
            }
          }, 'https://www.zeffy.com');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return null;
}