'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalRedirectLoader() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check if we're in the middle of a profile completion redirect
    const isProfileRedirect = localStorage.getItem('profileCompleteRedirect');
    
    if (isProfileRedirect === 'true') {
      setShowLoader(true);
      
      // Clear the flag after a delay to allow destination page to load
      setTimeout(() => {
        localStorage.removeItem('profileCompleteRedirect');
        setShowLoader(false);
      }, 3000); // Keep loading screen for 3 seconds to cover any flashes
    }
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile completed successfully!</h2>
        <p className="text-gray-600">Taking you to your destination...</p>
      </div>
    </div>
  );
}