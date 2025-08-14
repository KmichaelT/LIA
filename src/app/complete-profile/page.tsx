'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sponsor-a-child');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 py-32">
      <div className=" mx-auto px-4 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the sponsorship request form...</p>
      </div>
    </main>
  );
}