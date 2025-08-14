import React from 'react';

export default function SponsorCheckout() {
  return (
    <div className="min-h-screen bg-background">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Complete Your Sponsorship</h1>
            <p className="text-muted-foreground mb-4">
              Use the same email as your account. This helps us match your payment to your sponsorship.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> If you have a specific child you&apos;d like to sponsor, 
                please include their Child ID or name in the custom questions section of the form.
              </p>
            </div>
          </div>

          {/* Zeffy Donation Form Iframe */}
          <div 
            className="rounded-lg overflow-hidden shadow-lg border"
            style={{ 
              position: 'relative', 
              overflow: 'hidden', 
              height: '1200px', 
              width: '100%' 
            }}
          >
            <iframe
              title="Donation form powered by Zeffy"
              style={{ 
                position: 'absolute', 
                border: 0, 
                top: 0, 
                left: 0, 
                bottom: 0, 
                right: 0, 
                width: '100%', 
                height: '100%' 
              }}
              src="https://www.zeffy.com/embed/donation-form/d7a24fa2-5425-4e72-b337-120c4f0b8c64?utm_source=app&utm_medium=iframe&utm_campaign=sponsorship"
              allow="payment"
              allowTransparency
              loading="lazy"
            />
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Your payment will be processed securely by Zeffy</p>
                <p>✅ You&apos;ll receive a confirmation email</p>
                <p>✅ Your donation will appear in your dashboard within a few minutes</p>
                <p>✅ We&apos;ll match you with a child if you haven&apos;t specified one</p>
              </div>
            </div>
          </div>
    </div>
  );
}