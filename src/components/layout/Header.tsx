'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const MENU_ITEMS = [
  {
    title: 'Home',
    path: '/',
    hasDropdown: false,
  },
  {
    title: 'Pages',
    path: '/pages',
    hasDropdown: true,
    dropdownItems: [
      { title: 'About Us', path: '/about' },
      { title: 'Services', path: '/services' },
      { title: 'Event', path: '/events' },
      { title: 'Volunteer', path: '/volunteer' },
      { title: 'Contact', path: '/contact' },
      { title: 'FAQ', path: '/faq' },
    ],
  },
  {
    title: 'Causes',
    path: '/causes',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Causes Grid', path: '/causes' },
      { title: 'Causes List', path: '/causes-list' },
      { title: 'Causes Details', path: '/causes/1' },
    ],
  },
  {
    title: 'Blog',
    path: '/blog',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Blog Grid', path: '/blog' },
      { title: 'Blog Classic', path: '/blog-classic' },
      { title: 'Blog Details', path: '/blog/1' },
    ],
  },
  {
    title: 'Contact',
    path: '/contact',
    hasDropdown: false,
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="relative z-10">
          <Image
            src="/images/logo.svg"
            alt="Love In Action"
            width={90}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {MENU_ITEMS.map((item, index) => (
              <li key={index} className="relative group">
                <Link
                  href={item.path}
                  className="font-medium text-foreground hover:text-secondary transition-colors flex items-center"
                >
                  {item.title}
                  {item.hasDropdown && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1 h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  )}
                </Link>

                {item.hasDropdown && (
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white shadow-lg rounded-md overflow-hidden z-50">
                    <div className="py-2">
                      {item.dropdownItems?.map((dropdownItem, i) => (
                        <Link
                          key={i}
                          href={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-secondary transition-colors"
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScrqmqkKP8I7l3j2IOkXTn8boTsBbgoTbyQPxDvsSSKyvLI9w/viewform"
            className="btn-primary font-medium"
          >
            Sponsor a child
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 py-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/images/logo.svg"
                alt="Love In Action"
                width={90}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <button
              className="text-foreground focus:outline-none"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <ul className="space-y-6">
            {MENU_ITEMS.map((item, index) => (
              <li key={index}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      className="w-full flex items-center justify-between text-foreground font-medium"
                      onClick={() => toggleDropdown(index)}
                    >
                      <span>{item.title}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${
                          activeDropdown === index ? 'transform rotate-180' : ''
                        }`}
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                    <div
                      className={`mt-3 ml-4 space-y-3 overflow-hidden transition-all duration-300 ${
                        activeDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.dropdownItems?.map((dropdownItem, i) => (
                        <Link
                          key={i}
                          href={dropdownItem.path}
                          className="block text-muted-foreground hover:text-secondary transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className="block text-foreground font-medium hover:text-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/volunteer"
              className="btn-primary font-medium block text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsor a child
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
