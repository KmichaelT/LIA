import React from 'react';
import Link from 'next/link';
import { CheckCircle, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <Heart className="w-8 h-8 text-red-500 mx-auto" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-bold mb-6">Thank You & Welcome!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your donation has been received and your sponsor profile has been created successfully.
          </p>

          {/* What Happens Next */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-green-800 mb-4">What happens next:</h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>You&apos;ll receive a confirmation email with your receipt</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>Your donation will appear in your dashboard within 5-10 minutes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>If you specified a child, we&apos;ll link your sponsorship accordingly</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>If not, we&apos;ll match you with a child who needs support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>You&apos;ll receive updates about your sponsored child soon</span>
              </li>
            </ul>
          </div>

          {/* Impact Statement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Your Impact</h3>
            <p className="text-blue-700">
              Your sponsorship provides education, meals, healthcare, and spiritual guidance 
              to a child in need. You&apos;re literally changing a life – thank you for your heart of love in action!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profiles">
              <Button className="group">
                View Your Dashboard
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-muted-foreground mb-2">
              Questions about your donation?
            </p>
            <p className="text-sm">
              Contact us at <a href="mailto:support@loveinaction.co" className="text-primary hover:underline">support@loveinaction.co</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}