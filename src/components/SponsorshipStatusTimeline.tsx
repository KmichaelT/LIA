'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle, User } from 'lucide-react';
import { Sponsor, getSponsorStatusInfo } from '@/lib/sponsors';

interface SponsorshipStatusTimelineProps {
  sponsor: Sponsor;
}

export default function SponsorshipStatusTimeline({ sponsor }: SponsorshipStatusTimelineProps) {
  const statusInfo = getSponsorStatusInfo(sponsor);
  
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
    switch (status) {
      case 'matched':
        return <CheckCircle className="h-5 w-5 text-accent" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-secondary" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        title: 'Application Submitted',
        description: 'Your sponsorship request has been received',
        date: sponsor.createdAt || '',
        status: 'completed'
      },
    ];

    if (sponsor.profileComplete) {
      steps.push({
        title: 'Profile Complete',
        description: 'Your profile information has been completed',
        date: sponsor.createdAt || '', // This would be updated by Make.com
        status: 'completed'
      });
    } else {
      steps.push({
        title: 'Profile Processing',
        description: 'We are completing your profile information',
        date: '',
        status: 'current'
      });
    }

    if (sponsor.sponsorshipStatus === 'matched' && sponsor.assignedChild) {
      steps.push({
        title: 'Child Matched',
        description: `You have been matched with ${sponsor.assignedChild.fullName}`,
        date: sponsor.updatedAt || '',
        status: 'completed'
      });
    } else if (sponsor.profileComplete) {
      steps.push({
        title: 'Under Review',
        description: 'Our team is reviewing your application',
        date: '',
        status: sponsor.sponsorshipStatus === 'pending' ? 'current' : 'pending'
      });

      if (sponsor.sponsorshipStatus === 'matched') {
        steps.push({
          title: 'Child Assignment',
          description: 'We are finding the perfect child for you to sponsor',
          date: '',
          status: 'current'
        });
      }
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(statusInfo.status)}
          Sponsorship Status
          <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor}`}>
            {statusInfo.message}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sponsor Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Sponsor Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Email:</span>
              <span className="ml-2">{sponsor.email}</span>
            </div>
            {sponsor.firstName && sponsor.lastName && (
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">{sponsor.firstName} {sponsor.lastName}</span>
              </div>
            )}
            {sponsor.monthlyContribution && (
              <div>
                <span className="font-medium">Monthly Contribution:</span>
                <span className="ml-2">${sponsor.monthlyContribution}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Profile Status:</span>
              <span className="ml-2">{sponsor.profileComplete ? 'Complete' : 'Processing'}</span>
            </div>
          </div>
          
          {sponsor.motivation && (
            <div className="mt-3">
              <span className="font-medium">Motivation:</span>
              <p className="mt-1 text-gray-700 italic">"{sponsor.motivation}"</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h4 className="font-semibold">Application Timeline</h4>
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-accent text-white' :
                step.status === 'current' ? 'bg-primary text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.status === 'current' ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium">{step.title}</h5>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(step.date)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status-specific messages */}
        <div className="mt-6 p-4 rounded-lg border">
          {statusInfo.status === 'processing' && (
            <div className="text-secondary">
              <h5 className="font-medium mb-2">Profile Processing</h5>
              <p className="text-sm">
                We're currently completing your profile with information from your donation. This process is automated and should complete shortly.
              </p>
            </div>
          )}
          
          {statusInfo.status === 'pending' && (
            <div className="text-primary">
              <h5 className="font-medium mb-2">Under Review</h5>
              <p className="text-sm">
                Our team is reviewing your application. We'll contact you within 2-3 business days with an update.
              </p>
            </div>
          )}
          
          {statusInfo.status === 'matched' && !statusInfo.hasChild && (
            <div className="text-accent">
              <h5 className="font-medium mb-2">Match Approved</h5>
              <p className="text-sm">
                Great news! Your application has been approved. We're now finding the perfect child for you to sponsor.
              </p>
            </div>
          )}
          
          {statusInfo.status === 'matched' && statusInfo.hasChild && (
            <div className="text-accent">
              <h5 className="font-medium mb-2">Congratulations! 🎉</h5>
              <p className="text-sm">
                You are now sponsoring {statusInfo.childName}. You should receive detailed information about your sponsored child soon.
              </p>
            </div>
          )}
          
          {statusInfo.status === 'rejected' && (
            <div className="text-destructive">
              <h5 className="font-medium mb-2">Application Not Approved</h5>
              <p className="text-sm">
                Unfortunately, we were unable to approve your sponsorship application at this time. Please contact us if you have any questions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}