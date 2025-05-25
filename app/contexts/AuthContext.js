"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    // Check guest mode from localStorage
    const isGuestMode = localStorage.getItem('isGuest') === 'true';
    setGuestMode(isGuestMode);

    if (!isGuestMode) {
      checkAuthState();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthState = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const signup = async (email, password) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isGuest: !user && guestMode,
      isCustomer: user?.role === 'customer',
      isStaff: user?.role === 'staff'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};