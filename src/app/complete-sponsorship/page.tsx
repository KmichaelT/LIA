'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CompleteSponsorshipContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    // Check URL parameters for status from API redirect
    const status = searchParams.get('status');
    const error = searchParams.get('error');

    if (status) {
      switch (status) {
        case 'confirmed':
          setMessage('Thank you for confirming your email! Your sponsorship request has been created.');
          setMessageType('success');
          break;
        case 'existing-sponsor':
          setMessage('Welcome back! You already have an active sponsorship.');
          setMessageType('info');
          break;
        case 'pending':
          setMessage('Your sponsorship request is being processed.');
          setMessageType('info');
          break;
        case 'existing-submitted':
          setMessage('You already have a sponsorship request in progress. Email confirmation complete.');
          setMessageType('info');
          break;
        case 'existing-pending':
          setMessage('You already have a sponsorship request being reviewed by our team.');
          setMessageType('info');
          break;
        case 'existing-matched':
          setMessage('You already have an active sponsorship!');
          setMessageType('success');
          break;
        default:
          setMessage('Your sponsorship status has been updated.');
          setMessageType('info');
      }
    } else if (error) {
      switch (error) {
        case 'invalid-link':
          setMessage('The confirmation link is invalid. Please contact support.');
          setMessageType('error');
          break;
        case 'invalid-email':
          setMessage('The email address in the link is invalid.');
          setMessageType('error');
          break;
        case 'invalid-token':
          setMessage('The confirmation link has expired or is invalid.');
          setMessageType('error');
          break;
        case 'creation-failed':
          setMessage('Failed to create your sponsorship request. This may be due to a server configuration issue. Please contact support.');
          setMessageType('error');
          break;
        case 'server-error':
          setMessage('A server error occurred. Please contact support.');
          setMessageType('error');
          break;
        default:
          setMessage('An unexpected error occurred. Please contact support.');
          setMessageType('error');
      }
    } else {
      // No status parameters - redirect to child profile
      router.push('/child-profile');
      return;
    }

    setLoading(false);

    // Auto-redirect to child profile after showing message
    const redirectTimer = setTimeout(() => {
      router.push('/child-profile');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [searchParams, router]);


  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processing...
            </h1>
            <p className="text-gray-600">
              Please wait while we process your sponsorship confirmation.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-32">
      <div className=" mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {messageType === 'success' && <CheckCircle className="mx-auto h-16 w-16 text-accent mb-6" />}
          {messageType === 'error' && <XCircle className="mx-auto h-16 w-16 text-red-600 mb-6" />}
          {messageType === 'info' && <Info className="mx-auto h-16 w-16 text-primary mb-6" />}
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sponsorship Status
          </h1>
          
          <Alert className={`mb-6 text-left ${
            messageType === 'success' ? 'border-accent/20 bg-accent/10' :
            messageType === 'error' ? 'border-red-200 bg-red-50' :
            'border-primary/20 bg-primary/10'
          }`}>
            <AlertDescription className={
              messageType === 'success' ? 'text-accent' :
              messageType === 'error' ? 'text-red-800' :
              'text-primary'
            }>
              {message}
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <p className="text-gray-600">
              You will be redirected to your sponsorship dashboard shortly...
            </p>
          </div>

          <Button 
            onClick={() => router.push('/child-profile')}
            className="bg-primary text-white hover:bg-accent"
          >
            Go to Dashboard Now
          </Button>
          
          {messageType === 'error' && (
            <div className="mt-4">
              <a 
                href="mailto:support@loveinaction.co"
                className="text-primary hover:text-accent text-sm"
              >
                Contact Support
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CompleteSponsorshipPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we load your sponsorship information.
            </p>
          </div>
        </div>
      </main>
    }>
      <CompleteSponsorshipContent />
    </Suspense>
  );
}