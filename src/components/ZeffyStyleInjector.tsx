'use client';

import { useEffect } from 'react';

export function ZeffyStyleInjector() {
  useEffect(() => {
    const injectStyles = () => {
      try {
        // Try to find the iframe
        const iframe = document.querySelector('iframe[title*="Donation form"]') as HTMLIFrameElement;
        
        if (iframe && iframe.contentDocument) {
          console.log('✅ Iframe found and accessible');
          
          // Try to inject custom styles
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            /* Custom styles for Zeffy form */
            .MuiStack-root {
              background: linear-gradient(135deg, #your-primary-color, #your-secondary-color) !important;
            }
            
            .MuiInputBase-root {
              border-radius: 8px !important;
              border: 2px solid #your-border-color !important;
            }
            
            .css-1xqg4xw {
              background: #your-button-color !important;
              border-radius: 12px !important;
            }
            
            /* Hide Zeffy branding */
            .MuiTypography-caption {
              display: none !important;
            }
          `;
          
          iframe.contentDocument.head.appendChild(style);
          console.log('✅ Custom styles injected successfully!');
          
        } else {
          console.log('❌ Cannot access iframe content (CORS blocked)');
        }
      } catch (error) {
        console.log('❌ Style injection failed:', error);
      }
    };

    // Wait for iframe to load
    const checkInterval = setInterval(() => {
      const iframe = document.querySelector('iframe[title*="Donation form"]') as HTMLIFrameElement;
      if (iframe) {
        iframe.onload = () => {
          setTimeout(injectStyles, 1000); // Wait a bit more for content to render
        };
        clearInterval(checkInterval);
      }
    }, 500);

    // Cleanup
    return () => clearInterval(checkInterval);
  }, []);

  return null; // This is a utility component with no UI
}

// Alternative approach: CSS-in-JS targeting specific selectors
export function ZeffyCSSOverride() {
  useEffect(() => {
    // Create a style tag in the parent document
    const style = document.createElement('style');
    style.textContent = `
      /* Try to target iframe content (likely won't work due to CORS) */
      iframe[title*="Donation form"] {
        /* We can only style the iframe element itself, not its content */
        border: 4px solid #your-brand-color !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
      }
      
      /* If somehow the classes leak to parent document */
      .MuiStack-root {
        --zeffy-override: true;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}