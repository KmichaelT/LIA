"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Loader2, Heart, DollarSign } from 'lucide-react';
import { STRAPI_URL } from '@/lib/utils';

interface AdditionalSponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorId: number;
  sponsorEmail: string;
  onSuccess?: () => void;
}

export default function AdditionalSponsorshipModal({ 
  isOpen, 
  onClose, 
  sponsorId, 
  sponsorEmail,
  onSuccess 
}: AdditionalSponsorshipModalProps) {
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const totalCost = numberOfChildren * 25;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('jwt');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call API to update sponsorship request
      const response = await fetch(`${window.location.origin}/api/update-sponsorship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sponsorId,
          numberOfChildren,
          sponsorEmail
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Additional sponsorship request submitted:', result);
      
      setSubmitStatus('success');
      
      // Call success callback and close modal after delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form state
        setNumberOfChildren(1);
        setSubmitStatus(null);
      }, 2000);

    } catch (error) {
      console.error('Error submitting additional sponsorship request:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit request');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form state
      setNumberOfChildren(1);
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Sponsor Additional Children
          </DialogTitle>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600">
              Thank you for expanding your support. We'll process your request for {numberOfChildren} additional {numberOfChildren === 1 ? 'child' : 'children'} and update you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="numberOfChildren">How many additional children would you like to sponsor?</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Cost Breakdown</span>
                </div>
                <div className="text-sm text-gray-600">
                  ${25} × {numberOfChildren} {numberOfChildren === 1 ? 'child' : 'children'} = <span className="font-semibold text-gray-900">${totalCost}/month</span>
                </div>
                <div className="text-xs text-gray-500">
                  This amount will be charged to your existing payment method on file.
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Payment:</strong> Your existing payment method will be used for the additional sponsorship(s). 
                  You can update your payment information in your account settings.
                </p>
              </div>
            </div>

            {submitStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}