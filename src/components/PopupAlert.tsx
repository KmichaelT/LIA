"use client";

import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTopAnnouncement, type Announcement, type Link as LinkType } from '@/lib/announcements';

export default function PopupAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  
  // Helper function to get link URL and text
  const getLinkData = (announcement: Announcement) => {
    // Use simplified link structure
    const url = announcement.linkUrl || announcement.link || announcement.actionLink;
    const label = announcement.linkText || 'Learn More';
    
    if (!url) return null;
    
    return {
      url: url,
      label: label,
      isExternal: url.includes('http'),
      opensInPopup: false
    };
  };
  
  useEffect(() => {
    async function loadAnnouncementPopup() {
      try {
        const topAnnouncement = await getTopAnnouncement();
        
        // Only show popup for "announcement" type alerts
        if (topAnnouncement && topAnnouncement.type === 'announcement') {
          // Check if user has already seen this specific announcement
          const hasSeenPopup = localStorage.getItem(`hasSeenAnnouncement-${topAnnouncement.id}`);
          
          if (!hasSeenPopup) {
            setAnnouncement(topAnnouncement);
            // Show popup after a short delay
            const timer = setTimeout(() => {
              setIsVisible(true);
              // Set flag in localStorage for this specific announcement
              localStorage.setItem(`hasSeenAnnouncement-${topAnnouncement.id}`, "true");
            }, 1500);
            
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error('Error loading announcement popup:', error);
      }
    }

    loadAnnouncementPopup();
  }, []);
  
  if (!isVisible) return null;
  
  const linkData = announcement ? getLinkData(announcement) : null;
  
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
          <div className="flex justify-center mb-4">
            <Megaphone size={48} className="text-secondary" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-secondary">
            {announcement?.title || 'Announcement'}
          </h3>
          <p className="mb-4 text-gray-600">
            {announcement?.message || 'We have an important announcement for you.'}
          </p>
          <div className="flex justify-center space-x-4">
            {linkData && (
              <Link 
                href={linkData.url} 
                target={linkData.isExternal ? "_blank" : "_self"} 
                rel={linkData.isExternal ? "noopener noreferrer" : undefined}
              >
                <Button className="bg-secondary text-white hover:bg-secondary/90">
                  {linkData.label}
                </Button>
              </Link>
            )}
            <Button 
              variant="outline"
              onClick={() => setIsVisible(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}