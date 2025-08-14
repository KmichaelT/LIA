'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail, AlertCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmSponsorshipPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirmSponsorshipForUser = useCallback(async (userEmail: string) => {
    setLoading(true);
    setError('');

    try {
      // Call our API with the user's email
      const response = await fetch(`/api/confirm-sponsorship?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Success - redirect to child profile with status
        router.push(`/child-profile?status=${data.status}`);
      } else {
        // Error occurred
        setError(data.error || 'Failed to confirm sponsorship. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error confirming sponsorship:', error);
      setError('An error occurred. Please try again or contact support.');
      setLoading(false);
    }
  }, [router]);

  // Auto-confirm for logged-in users (only once)
  useEffect(() => {
    if (isAuthenticated && user?.email && !loading && !error) {
      confirmSponsorshipForUser(user.email);
    }
  }, [isAuthenticated, user?.email, confirmSponsorshipForUser, loading, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    await confirmSponsorshipForUser(email);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Checking your authentication status...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show auto-confirmation for logged-in users
  if (isAuthenticated && user?.email) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-accent mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirming Your Sponsorship
            </h1>
            <p className="text-gray-600 mb-4">
              Welcome back! We're automatically confirming your sponsorship for <strong>{user.email}</strong>.
            </p>
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                <span className="text-gray-600">Processing...</span>
              </div>
            )}
            {error && (
              <Alert className="mt-4 border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Show login prompt or email form for non-authenticated users
  return (
    <main className="min-h-screen bg-gray-50 py-32">
      <div className=" mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirm Your Sponsorship
            </h1>
            <p className="text-gray-600">
              Thank you for your interest in sponsoring a child! 
            </p>
          </div>

          {/* Login option */}
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center mb-2">
              <LogIn className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium text-primary">Already have an account?</h3>
            </div>
            <p className="text-sm text-primary/80 mb-3">
              Log in to automatically confirm your sponsorship with your account email.
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full bg-primary text-white hover:bg-accent"
            >
              Log In to Confirm
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or confirm with email</span>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive/20 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you used with Zeffy"
                required
                className="w-full"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                This should be the same email address you used when submitting your sponsorship form.
              </p>
            </div>

            <Button 
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary text-white hover:bg-accent disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm My Sponsorship
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h3 className="font-medium text-primary mb-2">What happens next?</h3>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• We'll confirm your sponsorship request</li>
              <li>• You'll see your request status and timeline</li>
              <li>• Our team will process your application</li>
              <li>• We'll match you with a child within 3-7 days</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a 
                href="mailto:support@loveinaction.co" 
                className="text-primary hover:text-accent"
              >
                support@loveinaction.co
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}