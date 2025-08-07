'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface SponsorProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface AuthUser extends User {
  sponsor?: SponsorProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (identifier: string, password: string) => Promise<{ user: AuthUser; hasProfile: boolean }>;
  refreshUserData: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://best-desire-8443ae2768.strapiapp.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch sponsor profile
  const fetchSponsorProfile = async (email: string, token: string): Promise<SponsorProfile | null> => {
    try {
      console.log('Fetching sponsor profile for email:', email);
      const response = await fetch(`${STRAPI_URL}/api/sponsors?filters[email][$eq]=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Sponsor profile fetch response:', data);
        
        // Try both Strapi v4 (.attributes) and v5 (direct) formats
        const rawProfile = data.data?.[0];
        const profile = rawProfile?.attributes || rawProfile || null;
        
        console.log('Raw profile data:', rawProfile);
        console.log('Extracted sponsor profile:', profile);
        return profile;
      } else {
        console.error('Failed to fetch sponsor profile. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
      return null;
    } catch (error) {
      console.error('Error fetching sponsor profile:', error);
      return null;
    }
  };

  const isAuthenticated = !!user;

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Verify token with Strapi
      fetch(`${STRAPI_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const userData = await response.json();
            // Fetch sponsor profile
            const sponsorProfile = await fetchSponsorProfile(userData.email, token);
            setUser({
              ...userData,
              sponsor: sponsorProfile
            });
            return userData;
          }
          throw new Error('Invalid token');
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('jwt');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store JWT token
      localStorage.setItem('jwt', data.jwt);
      
      // Fetch sponsor profile
      const sponsorProfile = await fetchSponsorProfile(data.user.email, data.jwt);
      
      // Set user data with sponsor profile
      const userWithSponsor = {
        ...data.user,
        sponsor: sponsorProfile
      };
      setUser(userWithSponsor);
      
      // Return user data and profile status
      return {
        user: userWithSponsor,
        hasProfile: !!sponsorProfile
      };
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Check if email confirmation is required
      if (data.jwt && data.user) {
        // User is immediately authenticated (confirmation disabled)
        localStorage.setItem('jwt', data.jwt);
        setUser(data.user);
      } else {
        // Email confirmation is required - no JWT token yet
        console.log('Registration successful, but email confirmation required');
        // Don't set user or JWT - user needs to confirm email first
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('jwt');
    if (!token || !user) return;
    
    try {
      console.log('Refreshing user data...');
      const sponsorProfile = await fetchSponsorProfile(user.email, token);
      setUser({
        ...user,
        sponsor: sponsorProfile
      });
      console.log('User data refreshed, sponsor profile:', sponsorProfile);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    refreshUserData,
    logout,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}