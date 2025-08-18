'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface LinkButtonProps {
  url?: string;
  label?: string;
  external?: boolean;
  opensInPopup?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  url,
  label,
  external = false,
  opensInPopup = false,
  variant = 'default',
  className = '',
  children
}) => {
  // If no URL is provided, don't render anything
  if (!url) return null;

  const buttonContent = (
    <Button variant={variant} className={className}>
      {children || label || 'Click here'}
    </Button>
  );

  // If opensInPopup is true, render in a dialog (for things like donation forms)
  if (opensInPopup) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {buttonContent}
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 overflow-hidden flex items-center justify-center">
          <iframe
            src={url}
            className="w-full h-full border-none"
            title={label || 'Content'}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // If external is true, open in new tab
  if (external) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  // Default: internal link
  return (
    <Link href={url}>
      {buttonContent}
    </Link>
  );
};