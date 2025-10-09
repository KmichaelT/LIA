'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { STRAPI_URL } from '@/lib/utils';

export default function EmailConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const confirmation = searchParams.get('confirmation');

      if (!confirmation) {
        setStatus('error');
        setMessage('Invalid confirmation link. The confirmation token is missing.');
        return;
      }

      try {
        // Call Strapi's email confirmation endpoint
        const response = await fetch(
          `${STRAPI_URL}/api/auth/email-confirmation?confirmation=${confirmation}`
        );

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage('Your email has been confirmed successfully! You can now log in to your account.');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(
            errorData?.error?.message || 
            'Failed to confirm your email. The link may have expired or already been used.'
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while confirming your email. Please try again or contact support.');
        console.error('Email confirmation error:', error);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {status === 'loading' && (
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirming Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                You will be redirected to the login page in a few seconds...
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Go to Login Page
                </Button>
              </Link>
              
              <Link href="/sponsor-a-child">
                <Button variant="outline" className="w-full">
                  Start Sponsorship Application
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmation Failed
            </h2>
            
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {message}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What to do next:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Try registering again with a different email</li>
                  <li>• Check if you already confirmed your email</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>

              <Link href="/register">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Register Again
                </Button>
              </Link>
              
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Try Logging In
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-500 pt-4">
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
        )}
      </div>
    </div>
  );
}
