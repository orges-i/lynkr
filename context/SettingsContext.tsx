import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../lib/supabaseHelpers';

interface SettingsContextValue {
  maintenanceMode: boolean;
  registrationsEnabled: boolean;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  saveSettings: (updates: { maintenance_mode?: boolean; registrations_enabled?: boolean }) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationsEnabled, setRegistrationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSettings();
    if (data) {
      setMaintenanceMode(!!data.maintenance_mode);
      setRegistrationsEnabled(!!data.registrations_enabled);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (updates: { maintenance_mode?: boolean; registrations_enabled?: boolean }) => {
    const data = await updateSettings(updates);
    if (data) {
      if (typeof data.maintenance_mode === 'boolean') setMaintenanceMode(data.maintenance_mode);
      if (typeof data.registrations_enabled === 'boolean') setRegistrationsEnabled(data.registrations_enabled);
      return true;
    }
    return false;
  };

  return (
    <SettingsContext.Provider
      value={{
        maintenanceMode,
        registrationsEnabled,
        loading,
        refreshSettings: loadSettings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
