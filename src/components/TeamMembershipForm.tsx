'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STRAPI_URL } from '@/lib/utils';

interface TeamMembershipFormData {
  name: string;
  email: string;
  phoneNumber: string;
  howYouCanHelp: string;
}

interface TeamMembershipFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function TeamMembershipForm({ onSuccess, onClose }: TeamMembershipFormProps) {
  const [formData, setFormData] = useState<TeamMembershipFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    howYouCanHelp: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${STRAPI_URL}/api/team-membership-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            howYouCanHelp: formData.howYouCanHelp,
            submittedAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit request');
      }

      const result = await response.json();
      console.log('Team membership request submitted:', result);
      
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting team membership request:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TeamMembershipFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your team membership request has been submitted successfully. We'll review your application and get back to you soon!
          </p>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Our Team</h3>
        <p className="text-gray-600">
          We'd love to have you join our mission! Fill out this form to let us know how you can help.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Your full name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required
            placeholder="Your phone number"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="howYouCanHelp">How You Can Help *</Label>
          <Textarea
            id="howYouCanHelp"
            value={formData.howYouCanHelp}
            onChange={(e) => handleInputChange('howYouCanHelp', e.target.value)}
            required
            placeholder="Tell us about your skills, interests, and how you'd like to contribute to our mission..."
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}