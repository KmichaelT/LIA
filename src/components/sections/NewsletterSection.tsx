'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (email subscription)
    console.log('Email subscription submitted:', email);
    // Reset form
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <section className="py-16 relative overflow-hidden bg-white">
 

      <div className=" relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-0">
              Get our latest updates.
            </h2>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="flex-1 px-4 py-3 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-secondary text-white px-6 py-3 rounded-r-md hover:bg-secondary/90 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
