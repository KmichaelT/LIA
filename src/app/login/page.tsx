'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/child-profile');
    }
  }, [isAuthenticated, router]);

  // Show loading if authenticated and redirecting
  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-md text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Already Logged In</h1>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginResult = await login(identifier, password);
      
      // Show redirecting state to prevent homepage flash
      setIsRedirecting(true);
      setIsLoading(false); // Stop login loading, start redirect loading
      
      // Small delay to ensure auth context is fully updated, then redirect
      setTimeout(() => {
        if (!loginResult.hasProfile) {
          // User needs to complete profile first, but keep their return URL
          router.push('/child-profile');
        } else {
          // User has profile, go to their original destination
          const returnUrl = localStorage.getItem('returnUrl') || localStorage.getItem('redirectAfterLogin');
          if (returnUrl) {
            localStorage.removeItem('returnUrl'); // Clean up
            localStorage.removeItem('redirectAfterLogin'); // Clean up
            router.push(returnUrl); // Go to original destination
          } else {
            router.push('/child-profile'); // Default fallback
          }
        }
      }, 500); // Brief delay to ensure smooth transition
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  // Show full-screen loading during redirect to prevent any homepage flash
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Taking you to your destination...</h2>
          <p className="text-gray-600">Please wait while we redirect you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-2">Sign in to your account</h1>
          <p className="mt-2">
            Access children profiles and make sponsorship requests
          </p>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isRedirecting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Taking you to your destination...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Not a sponsor yet?{' '}
              <Link 
                href="/register" 
                className="font-medium text-primary hover:text-primary/80"
              >
                Submit your sponsorship request
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}