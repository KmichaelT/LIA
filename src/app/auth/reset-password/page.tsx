'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { STRAPI_URL } from '@/lib/utils';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get the code from URL parameters
    const resetCode = searchParams.get('code');
    if (resetCode) {
      setCode(resetCode);
    } else {
      setStatus('error');
      setMessage('Invalid reset link. The reset code is missing.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    // Validate passwords
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Invalid reset code. Please request a new password reset link.');
      setIsLoading(false);
      return;
    }

    try {
      // Call Strapi's reset password endpoint
      const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          password: password,
          passwordConfirmation: confirmPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage('Your password has been reset successfully! You can now log in with your new password.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(
          errorData?.error?.message || 
          'Failed to reset password. The link may have expired or is invalid.'
        );
      }
    } catch (error) {
      console.error('Error resetting password:', error);
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
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600">
            Enter your new password below
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
              <Label htmlFor="password">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-2">Password Strength:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <div className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                    ✓ At least 6 characters
                  </div>
                  <div className={password !== confirmPassword ? 'text-gray-500' : password === confirmPassword && confirmPassword.length > 0 ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Passwords match
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !code}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
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

        {/* Success State Actions */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Go to Login Page
              </Button>
            </Link>
            
            <p className="text-center text-sm text-gray-600">
              You will be redirected automatically in a few seconds...
            </p>
          </div>
        )}

        {/* Error State - Request New Link */}
        {status === 'error' && message.includes('expired') && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Link href="/auth/forgot-password">
              <Button variant="outline" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        )}

        {/* Support Information */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Having trouble resetting your password?{' '}
            <a 
              href="mailto:support@loveinaction.co" 
              className="text-primary hover:text-primary/80"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
