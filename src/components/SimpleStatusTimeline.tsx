'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SimpleStatusTimelineProps {
  currentStatus: 'submitted' | 'pending' | 'matched' | 'rejected';
}

export default function SimpleStatusTimeline({ currentStatus }: SimpleStatusTimelineProps) {
  const steps = [
    {
      id: 'submitted',
      title: 'Application Received',
      description: 'Your sponsorship application has been submitted and received.',
      icon: CheckCircle,
    },
    {
      id: 'pending',
      title: 'Processing',
      description: 'We are reviewing your application and finding the perfect match.',
      icon: Clock,
    },
    {
      id: 'matched',
      title: 'Matched',
      description: 'Congratulations! You have been matched with a child.',
      icon: CheckCircle,
    },
  ];

  const getStepStatus = (stepId: string) => {
    switch (currentStatus) {
      case 'submitted':
        return stepId === 'submitted' ? 'current' : 'upcoming';
      case 'pending':
        if (stepId === 'submitted') return 'completed';
        if (stepId === 'pending') return 'current';
        return 'upcoming';
      case 'matched':
        if (stepId === 'matched') return 'completed';
        if (stepId === 'pending' || stepId === 'submitted') return 'completed';
        return 'upcoming';
      case 'rejected':
        if (stepId === 'submitted') return 'completed';
        if (stepId === 'pending') return 'rejected';
        return 'upcoming';
      default:
        return 'upcoming';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const getConnectorColor = (fromStep: number) => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStatus);
    if (currentStepIndex > fromStep) {
      return 'bg-green-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${getStatusColor(stepStatus)}`}
                >
                  {stepStatus === 'rejected' ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step Content */}
                <div className="text-center">
                  <h3 className={`font-semibold mb-1 ${
                    stepStatus === 'completed' || stepStatus === 'current' 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm max-w-32 ${
                    stepStatus === 'completed' || stepStatus === 'current'
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-4 ${getConnectorColor(index)} transition-colors duration-300`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Status Message */}
      <div className="mt-8 text-center">
        {currentStatus === 'submitted' && (
          <p className="text-gray-600">
            Thank you for submitting your application. We will review it and get back to you soon.
          </p>
        )}
        
        {currentStatus === 'pending' && (
          <p className="text-gray-600">
            Your application is being processed. We are working to find the perfect match for you.
          </p>
        )}
        
        {currentStatus === 'matched' && (
          <p className="text-green-600 font-medium">
            🎉 Congratulations! You have been successfully matched with a child.
          </p>
        )}
        
        {currentStatus === 'rejected' && (
          <div className="text-red-600">
            <p className="font-medium mb-2">Additional Information Required</p>
            <p className="text-sm">
              We need more information to process your application. 
              Please contact us at{' '}
              <a href="mailto:support@loveinaction.co" className="underline">
                support@loveinaction.co
              </a>{' '}
              for assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}