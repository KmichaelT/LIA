'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DonateSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (would connect to payment processor in real app)
    console.log('Donation form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', amount: '' });
    alert('Thank you for your donation!');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Image
          src="https://ext.same-assets.com/1309554318/3880204434.png"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      <div className=" relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-secondary font-medium mb-4 inline-block">donate</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Contribute to feed the hungry.
            </h2>
            <p className="text-white/70 mb-8 max-w-lg">
              Extend a helping hand, donate to provide for those facing hunger and make a difference in their lives.
            </p>
            <Link href="/contact" className="btn-primary">
              Join us now
            </Link>
          </div>

          {/* Form */}
          <div className="bg-white text-foreground rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Donation form</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount ($)"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-3 px-6 rounded-md hover:bg-secondary/90 transition-colors font-medium"
                >
                  Donate now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
