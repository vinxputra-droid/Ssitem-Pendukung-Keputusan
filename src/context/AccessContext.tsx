import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'viewer' | 'editor';

interface AccessContextType {
  role: UserRole;
  isEditor: boolean;
  pin: string;
  token: string;
  switchRoleWithPin: (inputPin: string) => boolean;
  changePin: (oldPin: string, newPin: string) => { success: boolean; message: string };
  switchToViewer: () => void;
  getViewerShareUrl: () => string;
  getEditorShareUrl: () => string;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PIN: 'spk_editor_pin',
  TOKEN: 'spk_editor_token',
  SESSION_ROLE: 'spk_session_role',
};

const DEFAULT_PIN = '123456';
const DEFAULT_TOKEN = 'spk_editor_sec_8923';

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pin, setPin] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
  });

  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || DEFAULT_TOKEN;
  });

  const [role, setRole] = useState<UserRole>('viewer');

  // Evaluate URL search params & session storage on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') || params.get('role');
    const tokenParam = params.get('token') || params.get('key');
    const currentPin = localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
    const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || DEFAULT_TOKEN;

    if (modeParam === 'editor' && (tokenParam === currentToken || tokenParam === currentPin)) {
      setRole('editor');
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ROLE, 'editor');
    } else {
      const savedSession = sessionStorage.getItem(STORAGE_KEYS.SESSION_ROLE);
      if (savedSession === 'editor') {
        setRole('editor');
      } else {
        setRole('viewer');
      }
    }
  }, []);

  const switchRoleWithPin = (inputPin: string): boolean => {
    if (inputPin.trim() === pin) {
      setRole('editor');
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ROLE, 'editor');
      return true;
    }
    return false;
  };

  const switchToViewer = () => {
    setRole('viewer');
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ROLE, 'viewer');
    // Remove query params if editor was in URL
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    url.searchParams.delete('role');
    url.searchParams.delete('token');
    url.searchParams.delete('key');
    window.history.replaceState({}, '', url.toString());
  };

  const changePin = (oldPin: string, newPin: string): { success: boolean; message: string } => {
    if (oldPin.trim() !== pin) {
      return { success: false, message: 'PIN lama tidak sesuai!' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'PIN baru minimal harus 4 karakter.' };
    }
    const cleanPin = newPin.trim();
    setPin(cleanPin);
    localStorage.setItem(STORAGE_KEYS.PIN, cleanPin);
    
    // Also update token
    const newToken = `token_${cleanPin}_${Date.now().toString(36)}`;
    setToken(newToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);

    return { success: true, message: 'PIN Editor berhasil diperbarui!' };
  };

  const getViewerShareUrl = (): string => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('role', 'viewer');
    return url.toString();
  };

  const getEditorShareUrl = (): string => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('mode', 'editor');
    url.searchParams.set('token', token);
    return url.toString();
  };

  const isEditor = role === 'editor';

  return (
    <AccessContext.Provider
      value={{
        role,
        isEditor,
        pin,
        token,
        switchRoleWithPin,
        changePin,
        switchToViewer,
        getViewerShareUrl,
        getEditorShareUrl,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = (): AccessContextType => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used within an AccessProvider');
  }
  return context;
};
