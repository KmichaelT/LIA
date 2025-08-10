"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { STRAPI_URL } from '@/lib/utils';

interface SponsorshipFormData {
  preferredAge?: string;
  preferredGender?: string;
  sponsee: number;
  motivation: string;
  hearAboutUs?: string;
}

export default function SponsorshipForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SponsorshipFormData>({
    preferredAge: '',
    preferredGender: '',
    sponsee: 25,
    motivation: '',
    hearAboutUs: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sponsee' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Check if user has sponsor profile
      if (!user?.sponsor) {
        setErrorMessage('Please complete your sponsor profile before submitting a request.');
        setIsSubmitting(false);
        return;
      }

      // Prepare the data using sponsor profile info and form preferences
      const requestData = {
        firstName: user.sponsor.firstName,
        lastName: user.sponsor.lastName,
        email: user.sponsor.email,
        phone: user.sponsor.phone,
        address: user.sponsor.address,
        city: user.sponsor.city,
        country: user.sponsor.country,
        motivation: formData.motivation,
        sponsee: formData.sponsee,
        requestStatus: 'pending',
        submittedAt: new Date().toISOString(),
        ...(formData.preferredAge && { preferredAge: formData.preferredAge }),
        ...(formData.preferredGender && { preferredGender: formData.preferredGender }),
        ...(formData.hearAboutUs && { hearAboutUs: formData.hearAboutUs }),
      };

      // Get JWT token for authenticated request
      const token = localStorage.getItem('jwt');
      
      const response = await fetch(`${STRAPI_URL}/api/sponsorship-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          data: requestData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Strapi error response:', errorData);
        const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Sponsorship request submitted:', result);
      
      setSubmitStatus('success');
      // Reset form
      setFormData({
        preferredAge: '',
        preferredGender: '',
        sponsee: 25,
        motivation: '',
        hearAboutUs: '',
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);

    } catch (error) {
      console.error('Error submitting sponsorship request:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sponsor a Child</h2>
        <p className="text-gray-600">
          Help transform a child's life through education and support. Fill out this form to begin your sponsorship journey.
        </p>
        {user?.sponsor && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✓ Welcome back, {user.sponsor.firstName} {user.sponsor.lastName}! Your profile information is loaded below. Just set your sponsorship preferences.
            </p>
          </div>
        )}
      </div>

      {submitStatus === 'success' && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Thank you! Your sponsorship request has been submitted successfully. We'll be in touch soon with more details about your sponsored child.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errorMessage || 'There was an error submitting your request. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sponsor Information Display */}
        {user?.sponsor ? (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sponsor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2">{user.sponsor.firstName} {user.sponsor.lastName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2">{user.sponsor.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <span className="ml-2">{user.sponsor.phone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <span className="ml-2">{user.sponsor.city}, {user.sponsor.country}</span>
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
            <p className="text-sm text-yellow-800 mb-3">
              Please complete your sponsor profile to submit sponsorship requests.
            </p>
            <a
              href="/complete-profile"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            >
              Complete Profile Now
            </a>
          </div>
        ) : null}

        {/* Sponsorship Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sponsorship Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredAge">Preferred Child Age</Label>
              <select
                id="preferredAge"
                name="preferredAge"
                value={formData.preferredAge}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary"
              >
                <option value="">No preference</option>
                <option value="5-7">5-7 years</option>
                <option value="8-10">8-10 years</option>
                <option value="11-13">11-13 years</option>
                <option value="14-16">14-16 years</option>
                <option value="17-18">17-18 years</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="preferredGender">Preferred Gender</Label>
              <select
                id="preferredGender"
                name="preferredGender"
                value={formData.preferredGender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary"
              >
                <option value="">No preference</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="sponsee">Monthly Sponsorship Amount (USD) *</Label>
            <Input
              id="sponsee"
              name="sponsee"
              type="number"
              min="25"
              step="5"
              required
              value={formData.sponsee}
              onChange={handleInputChange}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum $25/month</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          
          <div>
            <Label htmlFor="motivation">Why do you want to sponsor a child? *</Label>
            <Textarea
              id="motivation"
              name="motivation"
              rows={4}
              required
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="Tell us about your motivation to sponsor a child..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
            <select
              id="hearAboutUs"
              name="hearAboutUs"
              value={formData.hearAboutUs}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary"
            >
              <option value="">Select an option</option>
              <option value="website">Website</option>
              <option value="social-media">Social Media</option>
              <option value="friend-family">Friend/Family</option>
              <option value="event">Event</option>
              <option value="newsletter">Newsletter</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Sponsorship Request'
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            By submitting this form, you agree to our terms and conditions. 
            We'll contact you within 2-3 business days with more information.
          </p>
        </div>
      </form>
    </div>
  );
}