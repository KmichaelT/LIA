'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TicketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'golden';
}

export function TicketButton({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}: TicketButtonProps) {
  const isGolden = variant === 'golden';
  
  return (
    <button
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center",
        "px-8 py-3",
        "font-semibold text-sm uppercase tracking-wider",
        "transition-all duration-300 transform",
        "hover:scale-105 hover:shadow-2xl",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        
        // Ticket shape with perforated edges
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r",
        isGolden 
          ? "before:from-yellow-400 before:via-amber-400 before:to-yellow-500"
          : "before:from-primary before:via-accent before:to-primary",
        "before:rounded-lg",
        
        // Perforated edge effect (left)
        "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-4",
        "after:bg-repeat-y after:bg-[length:8px_8px]",
        "after:bg-[radial-gradient(circle_at_4px_4px,transparent_3px,currentColor_3px)]",
        
        // Main content area
        "bg-white dark:bg-gray-900",
        "border-2 border-dashed",
        isGolden
          ? "border-yellow-400 text-yellow-600 dark:text-yellow-400"
          : "border-primary text-primary dark:text-primary",
        "rounded-lg",
        
        // Ticket stub effect
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
        
        // Focus states
        isGolden
          ? "focus:ring-yellow-400"
          : "focus:ring-primary",
        
        className
      )}
      {...props}
    >
      {/* Left perforated edge */}
      <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-2 h-2 rounded-full",
              isGolden ? "bg-yellow-100" : "bg-gray-100"
            )} 
          />
        ))}
      </div>
      
      {/* Right perforated edge */}
      <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col justify-around">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-2 h-2 rounded-full",
              isGolden ? "bg-yellow-100" : "bg-gray-100"
            )}
          />
        ))}
      </div>
      
      {/* Ticket content */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Ticket icon */}
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
          />
        </svg>
        <span>{children}</span>
      </div>
      
      {/* Barcode effect at bottom */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-0.5 bg-current",
              i % 3 === 0 ? "h-3" : i % 2 === 0 ? "h-2" : "h-2.5"
            )}
          />
        ))}
      </div>
    </button>
  );
}

// Simplified ticket button for inline use
export function SimpleTicketButton({ 
  children, 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-4 py-2.5",
        "bg-accent",
        "text-white font-semibold text-sm",
        "rounded-md",
        "transition-all duration-200",
        "hover:shadow-lg hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        
       
        className
      )}
      {...props}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
        />
      </svg>
      {children}
    </button>
  );
}