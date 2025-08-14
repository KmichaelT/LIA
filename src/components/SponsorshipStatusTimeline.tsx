'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { SponsorshipRequest, getRequestStatusDisplay } from '@/lib/sponsorshipRequests';

interface SponsorshipStatusTimelineProps {
  request: SponsorshipRequest;
}

export default function SponsorshipStatusTimeline({ request }: SponsorshipStatusTimelineProps) {
  const statusInfo = getRequestStatusDisplay(request.status || request.requestStatus || 'pending');
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = (status || '').toLowerCase();
    switch (normalizedStatus) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-cyan-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'matched':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'zeffy-confirmed':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTimelineSteps = () => {
    const status = (request.status || request.requestStatus || 'pending').toLowerCase();
    
    return [
      {
        title: 'Email Confirmed',
        description: 'You confirmed your sponsorship from the email link',
        date: request.submittedAt,
        completed: true,
        icon: <CheckCircle className="h-4 w-4 text-cyan-600" />
      },
      {
        title: 'Payment Processing',
        description: 'We\'re confirming your payment details with Zeffy',
        date: null,
        completed: ['zeffy-confirmed', 'pending', 'approved', 'matched'].includes(status),
        current: status === 'submitted',
        icon: ['zeffy-confirmed', 'pending', 'approved', 'matched'].includes(status) ? 
               <CheckCircle className="h-4 w-4 text-purple-600" /> : 
               status === 'submitted' ? <Clock className="h-4 w-4 text-cyan-600" /> :
               <Clock className="h-4 w-4 text-gray-400" />
      },
      {
        title: 'Under Review',
        description: 'Our team is reviewing your request',
        date: null,
        completed: ['approved', 'matched'].includes(status),
        current: ['pending', 'zeffy-confirmed'].includes(status),
        icon: ['approved', 'matched'].includes(status) ? 
               <CheckCircle className="h-4 w-4 text-green-600" /> : 
               ['pending', 'zeffy-confirmed'].includes(status) ? <Clock className="h-4 w-4 text-yellow-600" /> : 
               <Clock className="h-4 w-4 text-gray-400" />
      },
      {
        title: 'Finding Your Match',
        description: 'We\'re finding the perfect child for you to sponsor',
        date: null,
        completed: status === 'matched',
        current: status === 'approved',
        icon: status === 'matched' ? <CheckCircle className="h-4 w-4 text-green-600" /> : 
              status === 'approved' ? <Clock className="h-4 w-4 text-yellow-600" /> : 
              <Clock className="h-4 w-4 text-gray-400" />
      },
      {
        title: 'Matched!',
        description: 'You\'ve been successfully matched with a child',
        date: request.processedAt,
        completed: status === 'matched',
        icon: status === 'matched' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-gray-400" />
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(request.status || request.requestStatus || 'pending')}
            <div>
              <CardTitle className="text-xl">Sponsorship Request Status</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                <span className="text-sm text-gray-600">
                  Submitted {formatDate(request.submittedAt)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{statusInfo.description}</p>
          
          {/* Request Details */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Your Request Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Monthly Contribution:</span>
                <span className="ml-2">${request.monthlyContribution || request.sponsee || 'Not specified'}</span>
              </div>
              {request.preferredAge && (
                <div>
                  <span className="font-medium text-gray-600">Preferred Age:</span>
                  <span className="ml-2">{request.preferredAge}</span>
                </div>
              )}
              {request.preferredGender && (
                <div>
                  <span className="font-medium text-gray-600">Preferred Gender:</span>
                  <span className="ml-2">{request.preferredGender}</span>
                </div>
              )}
              {request.hearAboutUs && (
                <div>
                  <span className="font-medium text-gray-600">How you heard about us:</span>
                  <span className="ml-2">{request.hearAboutUs.replace('-', ' ')}</span>
                </div>
              )}
            </div>
            
            {request.motivation && (
              <div className="mt-3">
                <span className="font-medium text-gray-600">Your motivation:</span>
                <p className="mt-1 text-gray-700 italic">"{request.motivation}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Request Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getTimelineSteps().map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 rounded-full p-1 ${
                  step.completed ? 'bg-green-100' : 
                  step.current ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className={`font-medium ${
                    step.completed ? 'text-green-900' :
                    step.current ? 'text-yellow-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-sm ${
                    step.completed ? 'text-green-700' :
                    step.current ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </div>
                  {step.date && (
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(step.date)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'submitted' && (
              <>
                <p className="text-gray-700">
                  Thank you for confirming your email! We're now processing your payment details with Zeffy and will move your request to review once confirmed.
                </p>
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <p className="text-sm text-cyan-800">
                    ⏱️ <strong>Next:</strong> Your status will automatically update once payment processing is complete.
                  </p>
                </div>
              </>
            )}

            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'zeffy-confirmed' && (
              <>
                <p className="text-gray-700">
                  Your payment has been confirmed! We're now reviewing your sponsorship request and will contact you within 2-3 business days.
                </p>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    ✅ <strong>Payment Status:</strong> Confirmed and processed successfully.
                  </p>
                </div>
              </>
            )}

            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'pending' && (
              <>
                <p className="text-gray-700">
                  We're currently reviewing your sponsorship request. Our team will contact you within 2-3 business days.
                </p>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> We'll send you an email update as soon as your request status changes.
                  </p>
                </div>
              </>
            )}
            
            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'approved' && (
              <p className="text-gray-700">
                Great news! Your request has been approved. We're now working to find the perfect child match based on your preferences. This process typically takes 3-7 days.
              </p>
            )}
            
            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'matched' && (
              <p className="text-gray-700">
                🎉 <strong>Congratulations!</strong> You've been matched with a child. You should see their profile in your dashboard above, and we'll be sending you detailed information about your sponsored child via email.
              </p>
            )}
            
            {(request.status || request.requestStatus || 'pending').toLowerCase() === 'rejected' && (
              <>
                <p className="text-gray-700">
                  We need to discuss your request in more detail. Please contact our team for more information.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    📞 Contact us at <strong>support@loveinaction.co</strong> or call us for assistance.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}