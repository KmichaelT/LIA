'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCategory, shouldRedirectFromSponsorPage } from '@/lib/userCategories';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Loader2, Mail, ExternalLink } from 'lucide-react';
export default function SponsorAChildPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isZeffyLoaded, setIsZeffyLoaded] = useState(false);

  useEffect(() => {
    // Check if Zeffy script is loaded
    const checkZeffyScript = () => {
      if (typeof window !== 'undefined' && (window as typeof window & { zeffy?: unknown }).zeffy) {
        setIsZeffyLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkZeffyScript, 500);
      }
    };
    checkZeffyScript();
  }, []);

  useEffect(() => {
    async function checkUserAccess() {
      if (!isAuthenticated || !user) {
        // Non-authenticated users must register first
        localStorage.setItem('returnUrl', '/sponsor-a-child');
        router.push('/register');
        return;
      }

      const token = localStorage.getItem('jwt');
      if (!token) {
        router.push('/register');
        return;
      }

      try {
        const categoryInfo = await getUserCategory(user, token);
        
        // Redirect SPONSOR users (those with existing sponsorships) to child-profile
        if (categoryInfo.category === 'SPONSOR') {
          setShouldRedirect(true);
          router.push('/child-profile');
          return;
        }

        // USER category can access the form
        setLoading(false);
      } catch (error) {
        console.error('Error checking user access:', error);
        setLoading(false);
      }
    }

    checkUserAccess();
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (shouldRedirect) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sponsor a Child
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of sponsors and make a lasting impact on a child's life. 
              Your monthly contribution provides education, healthcare, and hope.
            </p>
          </div>

          {/* Warning for users with existing sponsorships */}
          {isAuthenticated && (
            <Alert className="mb-8 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Note:</strong> You can only have one active sponsorship at a time. 
                If you already have a sponsorship or pending request, please visit your dashboard instead.
              </AlertDescription>
            </Alert>
          )}

          {/* Important Notice - Show user's email */}
          {user && (
            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Important - Use this email in the form:</strong> {user.email}
                <br />
                <span className="text-sm">
                  After submitting your sponsorship form, you'll receive an email with a verification link. 
                  You must click this link to complete your sponsorship request.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Zeffy Form Container */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Your Sponsorship Application
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the secure form below to start your sponsorship journey. 
                The form will collect your contact information and sponsorship preferences.
              </p>
            </div>

            {/* Zeffy Iframe */}
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.zeffy.com/embed/ticketing/child-sponsorship"
                width="100%"
                style={{ 
                  minHeight: '800px',
                  height: '800px',
                  border: 'none'
                }}
                frameBorder="0"
                className="w-full"
                title="Child Sponsorship Form"
                scrolling="yes"
                allowFullScreen
              />
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">
                    What happens next?
                  </h3>
                  <ol className="list-decimal list-inside text-blue-800 space-y-1">
                    <li>Complete the form above with your information and preferences</li>
                    <li>Check your email for a verification message from our system</li>
                    <li>Click the verification link to activate your sponsorship request</li>
                    <li>Our team will review your application and find a suitable match</li>
                    <li>You'll receive your child's profile and welcome package</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Access */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Having trouble with the form above?
            </p>
            <a
              href="https://www.zeffy.com/embed/ticketing/child-sponsorship"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Open form in new window</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Success State (shown when coming from Zeffy) */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true' && (
            <Alert className="mt-8 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Form submitted successfully!</strong> Please check your email for a verification link 
                to complete your sponsorship request.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
  );
}