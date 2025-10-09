'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { STRAPI_URL } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Call Strapi's forgot password endpoint
      const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Password reset link has been sent to your email address.');
        setEmail(''); // Clear the form
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(
          errorData?.error?.message || 
          'Failed to send password reset email. Please try again or contact support.'
        );
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-8">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the email address associated with your account
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What to do next:</h3>
              <ol className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                  Check your email inbox (including spam folder)
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                  Click the password reset link in the email
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                  Enter your new password
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                  Log in with your new credentials
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Go to Login Page
                </Button>
              </Link>
              
              <button
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                }}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                Try a different email address
              </button>
            </div>
          </div>
        )}

        {/* Support Information */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@loveinaction.co" 
              className="text-primary hover:text-primary/80"
            >
              support@loveinaction.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
