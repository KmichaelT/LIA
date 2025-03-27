'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-Love In Action-brown-dark text-primary pt-20 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/images/logo.svg"
                alt="Love In Action"
                width={100}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-muted-foreground mb-6 pr-10">
              Every donation brings us closer to creating a world where all are valued and loved.
            </p>
            <div className="space-y-3">
              <a href="mailto:infocharity816@gmail.com" className="flex items-center text-muted-foreground hover:text-secondary transition-colors">
                <Mail className="h-5 w-5 mr-3" />
                <span>infocharity816@gmail.com</span>
              </a>
              <a href="tel:+11234567890" className="flex items-center text-muted-foreground hover:text-secondary transition-colors">
                <Phone className="h-5 w-5 mr-3" />
                <span>+1 123 456 7890</span>
              </a>
            </div>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xl font-medium mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-secondary transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-secondary transition-colors">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-secondary transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-secondary transition-colors">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-secondary transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xl font-medium mb-6">Services</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donation online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donor centers
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-muted-foreground hover:text-secondary transition-colors">
                  Volunteering
                </Link>
              </li>
            </ul>
          </div>

          {/* Donations Links */}
          <div>
            <h4 className="text-xl font-medium mb-6">Donations</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donor wall
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donation confirmation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donation history
                </Link>
              </li>
              <li>
                <Link href="/causes/1" className="text-muted-foreground hover:text-secondary transition-colors">
                  Donations details
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            Copyright {new Date().getFullYear()} <Link href="/" className="text-secondary hover:text-secondary transition-colors">Love In Action</Link>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
