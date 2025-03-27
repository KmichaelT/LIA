"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";

export default function PopupAlert() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenTournamentPopup");
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Set flag in localStorage
        localStorage.setItem("hasSeenTournamentPopup", "true");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setIsVisible(false)}
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-secondary">Upcoming Sprot Tournament!</h3>
          <p className="mb-4">Join us for our annual charity tournament on May 15th. All proceeds go directly to supporting children in Boreda.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/tournament">
              <Button className="bg-secondary text-white hover:bg-secondary/90">
                Buy Tickets
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => setIsVisible(false)}
            >
              Remind Me Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}