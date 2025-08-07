'use client';

import SponsorshipForm from '@/components/SponsorshipForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SponsorPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4">
          <SponsorshipForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}