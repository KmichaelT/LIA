'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { STRAPI_URL } from '@/lib/utils';

export default function CompleteProfilePage() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      if (!user?.email) {
        throw new Error('User email not found. Please log in again.');
      }

      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user.email, // Use authenticated user's email
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      };

      const token = localStorage.getItem('jwt');
      console.log('JWT Token exists:', !!token);
      console.log('Profile data being sent:', profileData);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${STRAPI_URL}/api/sponsors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          data: profileData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Strapi error response:', errorData);
        const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Sponsor profile created:', result);
      
      setSubmitStatus('success');
      setIsSubmitting(false);
      
      // Show redirecting state to prevent homepage flash
      setIsRedirecting(true);
      
      // Refresh user data to include the new sponsor profile
      await refreshUserData();
      
      // Get the return URL where user originally wanted to go
      const returnUrl = localStorage.getItem('returnUrl');
      console.log('Profile completed, return URL:', returnUrl);
      
      // Set a flag to keep loading screen persistent across navigation
      localStorage.setItem('profileCompleteRedirect', 'true');
      
      // Immediate redirect - let the loading screen handle the visual transition
      if (returnUrl) {
        localStorage.removeItem('returnUrl'); // Clean up
        console.log('Redirecting to return URL:', returnUrl);
        window.location.href = returnUrl; // Direct navigation
      } else {
        console.log('No return URL, going to homepage');
        window.location.href = '/'; // Direct navigation for consistency
      }

    } catch (error) {
      console.error('Error creating sponsor profile:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      // Only reset submitting if we're not in redirecting state
      if (!isRedirecting) {
        setIsSubmitting(false);
      }
    }
  };

  // If user is not authenticated, redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  // If user already has a sponsor profile, redirect to home
  if (user?.sponsor) {
    router.push('/');
    return null;
  }

  // Show full-screen loading during redirect to prevent homepage flash
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile completed successfully!</h2>
          <p className="text-gray-600">Taking you to your destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Welcome, {user?.username}! Complete your sponsor profile to start sponsoring children.
          </p>
        </div>

        {submitStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile completed successfully! Redirecting to homepage...
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage || 'There was an error creating your profile. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Account Email Display */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <Label className="text-sm font-medium text-gray-600">Account Email</Label>
            <p className="text-sm text-gray-900 mt-1">{user?.email}</p>
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
                  Creating Profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              This information will be used for sponsorship requests and communication.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}