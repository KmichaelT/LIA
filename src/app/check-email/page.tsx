'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

export default function CheckEmailPage() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // Note: This would need to be implemented in Strapi
      // For now, just show a message
      setTimeout(() => {
        setResendMessage('If your email is in our system, we\'ve sent another confirmation link.');
        setIsResending(false);
      }, 2000);
    } catch (error) {
      setResendMessage('Failed to resend confirmation email. Please try again.');
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps:</h3>
            <ol className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                Check your email inbox (including spam folder)
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                Click the confirmation link in the email
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                Log in with your credentials
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                Complete your sponsor profile
              </li>
            </ol>
          </div>

          {resendMessage && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {resendMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Confirmation Email
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600 mb-2">
                Already confirmed your email?
              </p>
              <Link 
                href="/login" 
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>
            Didn't receive an email? Check your spam folder or contact support if you continue to have issues.
          </p>
        </div>
      </div>
    </div>
  );
}