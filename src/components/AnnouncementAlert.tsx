'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Megaphone, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { getTopAnnouncement, type Announcement, type Link as LinkType } from '@/lib/announcements';

export default function AnnouncementAlert() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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
    async function loadAnnouncement() {
      try {
        const topAnnouncement = await getTopAnnouncement();
        if (topAnnouncement && !isDismissed) {
          setAnnouncement(topAnnouncement);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error loading announcement:', error);
      }
    }

    loadAnnouncement();
  }, [isDismissed]);

  useEffect(() => {
    // Add/remove CSS class to body to adjust page spacing
    if (isVisible && announcement) {
      document.body.classList.add('has-announcement-alert');
    } else {
      document.body.classList.remove('has-announcement-alert');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-announcement-alert');
    };
  }, [isVisible, announcement]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-gray-600',
          hover: 'hover:text-gray-200',
          icon: Info,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-600',
          hover: 'hover:text-yellow-200',
          icon: AlertTriangle,
        };
      case 'success':
        return {
          bg: 'bg-green-600',
          hover: 'hover:text-green-200',
          icon: CheckCircle,
        };
      default: // announcement
        return {
          bg: 'bg-blue-600',
          hover: 'hover:text-blue-200',
          icon: Megaphone,
        };
    }
  };

  if (!announcement || !isVisible) {
    return null;
  }

  const alertStyles = getAlertStyles(announcement.type || 'announcement');
  const IconComponent = alertStyles.icon;

  return (
    <div className={`${alertStyles.bg} text-white px-4 py-3 fixed top-0 left-0 right-0 z-[60] border-0`}>
      <div className=" mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <IconComponent size={20} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xl text-white font-medium">
              {announcement.title && (
                <span className="font-bold mr-2">{announcement.title}:</span>
              )}
              {announcement.message}
            </p>
          </div>
          
          {(() => {
            const linkData = getLinkData(announcement);
            return linkData && (
              <a
                href={linkData.url}
                target={linkData.isExternal ? "_blank" : "_self"}
                rel={linkData.isExternal ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center space-x-1 text-sm font-medium ${alertStyles.hover} transition-colors whitespace-nowrap`}
              >
                <span>{linkData.label}</span>
                {linkData.isExternal && <ExternalLink size={14} />}
              </a>
            );
          })()}
        </div>

        <button
          onClick={handleDismiss}
          className={`ml-4 text-white ${alertStyles.hover} transition-colors flex-shrink-0`}
          aria-label="Dismiss announcement"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}