'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Megaphone, Info, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCategory, getNavigationConfig, type UserCategoryInfo } from '@/lib/userCategories';
import { getTopAnnouncement, type Announcement } from '@/lib/announcements';

interface DropdownItem {
  title: string;
  path: string;
}

interface MenuItem {
  title: string;
  path: string;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "About Us",
    path: '/about',
    hasDropdown: false,
  },
  {
    title: "Blog",
    path: '/blog',
    hasDropdown: false,
  },
  {
    title: "Gallery",
    path: '/gallery',
    hasDropdown: false,
  },
];
/* 
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
*/

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCategory, setUserCategory] = useState<UserCategoryInfo | null>(null);
  const [navigationConfig, setNavigationConfig] = useState<{
    showLoginButton: boolean;
    showSponsorButton: boolean;
    showMyChildrenButton: boolean;
    showCompleteProfileButton: boolean;
    loginButtonText: string;
    loginButtonHref: string;
    sponsorButtonText: string;
    sponsorButtonHref: string;
    myChildrenButtonHref: string;
    completeProfileButtonHref: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

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

  useEffect(() => {
    async function determineUserCategory() {
      setLoading(true);
      
      const token = localStorage.getItem('jwt');
      
      try {
        const categoryInfo = await getUserCategory(user, token);
        const navConfig = getNavigationConfig(categoryInfo);
        
        setUserCategory(categoryInfo);
        setNavigationConfig(navConfig);
      } catch (error) {
        console.error('Error determining user category:', error);
        // Fallback configuration
        setUserCategory(null);
        setNavigationConfig({
          showLoginButton: !isAuthenticated,
          showSponsorButton: isAuthenticated,
          showMyChildrenButton: false,
          showCompleteProfileButton: false,
          loginButtonText: 'Login',
          loginButtonHref: '/login',
          sponsorButtonText: 'Sponsor a Child',
          sponsorButtonHref: isAuthenticated ? '/sponsor-a-child' : '/login',
          myChildrenButtonHref: '/child-profile',
          completeProfileButtonHref: '/complete-profile',
        });
      } finally {
        setLoading(false);
      }
    }

    determineUserCategory();
  }, [isAuthenticated, user]);

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const topAnnouncement = await getTopAnnouncement();
        if (topAnnouncement) {
          setAnnouncement(topAnnouncement);
          setIsAnnouncementVisible(true);
        }
      } catch (error) {
        console.error('Error loading announcement:', error);
      }
    }

    loadAnnouncement();
  }, []);

  const handleDismissAnnouncement = () => {
    setIsAnnouncementVisible(false);
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-gray-600',
          hover: 'hover:text-gray-200',
          icon: Info,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-600',
          hover: 'hover:text-yellow-200',
          icon: AlertTriangle,
        };
      case 'success':
        return {
          bg: 'bg-green-600',
          hover: 'hover:text-green-200',
          icon: CheckCircle,
        };
      default: // announcement
        return {
          bg: 'bg-blue-600',
          hover: 'hover:text-blue-200',
          icon: Megaphone,
        };
    }
  };

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

  const alertStyles = getAlertStyles(announcement?.type || 'announcement');
  const IconComponent = alertStyles.icon;

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Bar for non-announcement alerts only */}
      {announcement && isAnnouncementVisible && announcement.type !== 'announcement' && (
        <div className={`${alertStyles.bg} text-white px-4 py-3`}>
          <div className=" mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <IconComponent size={20} className="flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {announcement.title && (
                    <span className="font-bold mr-2">{announcement.title}:</span>
                  )}
                  {announcement.message}
                </p>
              </div>
              
              {announcement.link && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-1 text-sm font-medium ${alertStyles.hover} transition-colors whitespace-nowrap`}
                >
                  <span>{announcement.linkText || 'Learn More'}</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            <button
              onClick={handleDismissAnnouncement}
              className={`ml-4 text-white ${alertStyles.hover} transition-colors flex-shrink-0`}
              aria-label="Dismiss announcement"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
      <div className=" mx-auto px-4 flex container  justify-between items-center">
        <Link href="/" className="relative z-10">
          <Image
            src="/images/logo-new.svg"
            alt="Love In Action"
            width={90}
            height={32}
            style={{ height: '32px', width: 'auto' }}
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

          <div className="flex items-center space-x-3">
            {!loading && navigationConfig?.showCompleteProfileButton && (
              <Link
                href={navigationConfig.completeProfileButtonHref}
                className="btn-outline font-medium"
              >
                Complete Profile
              </Link>
            )}

            {!loading && navigationConfig?.showMyChildrenButton && (
              <Link
                href={navigationConfig.myChildrenButtonHref}
                className="btn-secondary font-medium flex items-center space-x-2"
              >
                <User size={16} />
                <span>Child Profile</span>
              </Link>
            )}
            
            {!loading && navigationConfig?.showSponsorButton && (
              <Link
                href={navigationConfig.sponsorButtonHref}
                className="btn-primary font-medium"
              >
                {navigationConfig.sponsorButtonText}
              </Link>
            )}

            {!loading && navigationConfig?.showLoginButton && (
              <Link
                href={navigationConfig.loginButtonHref}
                className="btn-primary font-medium"
              >
                {navigationConfig.loginButtonText}
              </Link>
            )}
            
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
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
        <div className=" mx-auto px-4 py-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/images/logo-new.svg"
                alt="Love In Action"
                width={90}
                height={32}
                style={{ height: '32px', width: 'auto' }}
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

          <div className="mt-8 space-y-4">
            {!loading && navigationConfig?.showCompleteProfileButton && (
              <Link
                href={navigationConfig.completeProfileButtonHref}
                className="btn-outline font-medium block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Complete Profile
              </Link>
            )}

            {!loading && navigationConfig?.showMyChildrenButton && (
              <Link
                href={navigationConfig.myChildrenButtonHref}
                className="btn-secondary font-medium flex items-center justify-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={16} />
                <span>Child Profile</span>
              </Link>
            )}
            
            {!loading && navigationConfig?.showSponsorButton && (
              <Link
                href={navigationConfig.sponsorButtonHref}
                className="btn-primary font-medium block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {navigationConfig.sponsorButtonText}
              </Link>
            )}

            {!loading && navigationConfig?.showLoginButton && (
              <Link
                href={navigationConfig.loginButtonHref}
                className="btn-primary font-medium block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {navigationConfig.loginButtonText}
              </Link>
            )}
            
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 mx-auto text-gray-600 hover:text-gray-900 transition-colors py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
