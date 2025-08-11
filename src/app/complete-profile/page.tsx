'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Info, CheckCircle, Heart, Users, Calendar } from 'lucide-react';
import { ZeffyStyleInjector, ZeffyCSSOverride } from '@/components/ZeffyStyleInjector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isRedirecting, setIsRedirecting] = useState(false);

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
    <section className="bg-background py-24">
      {/* Attempt to inject custom styles into Zeffy iframe */}
      <ZeffyStyleInjector />
      <ZeffyCSSOverride />
      
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Complete Your Profile & Start Sponsoring
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Welcome, {user?.username}! Complete your profile and make your first donation to start sponsoring a child.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 shadow-none">
            {/* Zeffy Iframe - Spans 2 columns */}
            <div className="lg:col-span-2 shadow-none">
              <Card className="border-0 shadow-none h-full">
                <CardContent className="p-0 shadow-none">
                  <div 
                    style={{
                      height: 'calc(100vh - 280px)',
                      minHeight: '650px',
                      maxHeight: '900px',
                      position: 'relative',
                      boxShadow: 'none',
                    }}
                  >
                    <iframe 
                      title='Donation form powered by Zeffy' 
                      className="absolute inset-0 w-full h-full border-0 rounded-lg shadow-none"
                      src='https://www.zeffy.com/embed/ticketing/sponsorship-signup' 
                      allowPaymentRequest 
                      allowTransparency={true}>
                    </iframe>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information - Single column */}
            <div className="space-y-6">
              {/* Important Notice */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-amber-900 font-semibold mb-2">
                        Important: Use this email
                      </p>
                      <p className="text-amber-800 font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What Happens Next */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Quick & Easy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your profile creates automatically after donation. You'll be matched with a child and receive updates monthly.
                  </p>
                </CardContent>
              </Card>

              {/* Support */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">Questions?</p>
                <a href="mailto:support@loveinaction.co" className="text-primary font-medium hover:underline">
                  support@loveinaction.co
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  🔒 Secure SSL Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}