import React, { createContext, useState, useContext, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean; // Always true, can't be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieContextType {
  cookieConsent: boolean | null; // null means not decided yet
  preferences: CookiePreferences;
  updatePreferences: (preferences: Partial<CookiePreferences>) => void;
  acceptAllCookies: () => void;
  acceptSelectedCookies: () => void;
  rejectNonEssentialCookies: () => void;
  openCookieSettings: () => void;
  showCookieDialog: boolean;
  setShowCookieDialog: (show: boolean) => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [showCookieDialog, setShowCookieDialog] = useState<boolean>(false);

  // Load saved preferences from localStorage on initial render
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');

    if (savedConsent) {
      setCookieConsent(savedConsent === 'true');
    } else {
      // If no saved preference, show the cookie dialog
      setShowCookieDialog(true);
    }

    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        // Ensure necessary cookies are always enabled
        setPreferences({ ...parsedPreferences, necessary: true });
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (cookieConsent !== null) {
      localStorage.setItem('cookieConsent', String(cookieConsent));
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    }
  }, [cookieConsent, preferences]);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
      necessary: true, // Always keep necessary cookies enabled
    }));
  };

  const acceptAllCookies = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    setCookieConsent(true);
    setShowCookieDialog(false);
  };

  const acceptSelectedCookies = () => {
    setCookieConsent(true);
    setShowCookieDialog(false);
  };

  const rejectNonEssentialCookies = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    setCookieConsent(false);
    setShowCookieDialog(false);
  };

  const openCookieSettings = () => {
    setShowCookieDialog(true);
  };

  return (
    <CookieContext.Provider
      value={{
        cookieConsent,
        preferences,
        updatePreferences,
        acceptAllCookies,
        acceptSelectedCookies,
        rejectNonEssentialCookies,
        openCookieSettings,
        showCookieDialog,
        setShowCookieDialog,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieConsent = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};