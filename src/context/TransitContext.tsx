import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  TransportMode,
  TransportModeId,
  TransitLine,
  Station,
  FareBracket,
  RouteResult,
} from '../types/transit';
import {
  INITIAL_TRANSPORT_MODES,
  INITIAL_TRANSIT_LINES,
  INITIAL_STATIONS,
  INITIAL_FARE_BRACKETS,
} from '../data/initialData';
import { findShortestPath } from '../utils/pathfinder';

interface TransitContextType {
  modes: TransportMode[];
  lines: TransitLine[];
  stations: Station[];
  fareBrackets: FareBracket[];
  selectedModeId: TransportModeId;
  setSelectedModeId: (modeId: TransportModeId) => void;
  startStationId: string;
  setStartStationId: (id: string) => void;
  endStationId: string;
  setEndStationId: (id: string) => void;
  routeResult: RouteResult | null;
  swapStations: () => void;
  clearSelection: () => void;

  // Admin controls
  isAdminAuthenticated: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Data management
  addStation: (stationData: Omit<Station, 'id'>) => void;
  updateStation: (id: string, updates: Partial<Station>) => void;
  deleteStation: (id: string) => void;
  addFareBracket: (bracketData: Omit<FareBracket, 'id'>) => void;
  updateFareBracket: (id: string, updates: Partial<FareBracket>) => void;
  deleteFareBracket: (id: string) => void;
  resetToDefaults: () => void;

  // Stats
  isDataCustomized: boolean;
}

const STORAGE_KEY_STATIONS = 'egypt_transit_stations_v2';
const STORAGE_KEY_FARES = 'egypt_transit_fares_v2';

const TransitContext = createContext<TransitContextType | undefined>(undefined);

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const modes = INITIAL_TRANSPORT_MODES;
  const lines = INITIAL_TRANSIT_LINES;

  // Load stations from localStorage or fallback
  const [stations, setStations] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load stations from localStorage', e);
    }
    return INITIAL_STATIONS;
  });

  // Load fare brackets from localStorage or fallback
  const [fareBrackets, setFareBrackets] = useState<FareBracket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FARES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load fare brackets from localStorage', e);
    }
    return INITIAL_FARE_BRACKETS;
  });

  // Persist stations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATIONS, JSON.stringify(stations));
    } catch (e) {
      console.error('Failed to save stations to localStorage', e);
    }
  }, [stations]);

  // Persist fares
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FARES, JSON.stringify(fareBrackets));
    } catch (e) {
      console.error('Failed to save fares to localStorage', e);
    }
  }, [fareBrackets]);

  // Planner selections
  const [selectedModeId, setSelectedModeIdState] = useState<TransportModeId>('metro');
  const [startStationId, setStartStationId] = useState<string>('m1_17'); // Default: Sadat
  const [endStationId, setEndStationId] = useState<string>('m2_08'); // Default: Shohadaa

  // Admin states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // When mode changes, set reasonable defaults for start and end
  const setSelectedModeId = (newModeId: TransportModeId) => {
    setSelectedModeIdState(newModeId);
    const available = stations.filter((s) => s.modeId === newModeId);
    if (available.length >= 2) {
      setStartStationId(available[0].id);
      setEndStationId(available[Math.min(5, available.length - 1)].id);
    } else if (available.length === 1) {
      setStartStationId(available[0].id);
      setEndStationId(available[0].id);
    } else {
      setStartStationId('');
      setEndStationId('');
    }
  };

  // Swap start and end
  const swapStations = () => {
    const temp = startStationId;
    setStartStationId(endStationId);
    setEndStationId(temp);
  };

  const clearSelection = () => {
    setStartStationId('');
    setEndStationId('');
  };

  // Calculate route reactively whenever selections or data changes
  const routeResult = useMemo(() => {
    if (!startStationId || !endStationId) return null;
    return findShortestPath(startStationId, endStationId, stations, lines, fareBrackets);
  }, [startStationId, endStationId, stations, lines, fareBrackets]);

  // Admin login check (Passcode: 0000)
  const loginAdmin = (password: string): boolean => {
    if (password === '0000') {
      setIsAdminAuthenticated(true);
      setIsAdminModalOpen(false);
      setIsAdminDashboardOpen(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminDashboardOpen(false);
  };

  // Station CRUD
  const addStation = (stationData: Omit<Station, 'id'>) => {
    const newId = `custom_st_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newStation: Station = {
      ...stationData,
      id: newId,
    };
    setStations((prev) => [...prev, newStation]);
  };

  const updateStation = (id: string, updates: Partial<Station>) => {
    setStations((prev) =>
      prev.map((st) => (st.id === id ? { ...st, ...updates } : st))
    );
  };

  const deleteStation = (id: string) => {
    setStations((prev) => prev.filter((st) => st.id !== id));
    if (startStationId === id) setStartStationId('');
    if (endStationId === id) setEndStationId('');
  };

  // Fare Bracket CRUD
  const addFareBracket = (bracketData: Omit<FareBracket, 'id'>) => {
    const newId = `custom_fare_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newBracket: FareBracket = {
      ...bracketData,
      id: newId,
    };
    setFareBrackets((prev) => [...prev, newBracket]);
  };

  const updateFareBracket = (id: string, updates: Partial<FareBracket>) => {
    setFareBrackets((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, ...updates } : fb))
    );
  };

  const deleteFareBracket = (id: string) => {
    setFareBrackets((prev) => prev.filter((fb) => fb.id !== id));
  };

  const resetToDefaults = () => {
    setStations(INITIAL_STATIONS);
    setFareBrackets(INITIAL_FARE_BRACKETS);
    try {
      localStorage.removeItem(STORAGE_KEY_STATIONS);
      localStorage.removeItem(STORAGE_KEY_FARES);
    } catch (e) {
      console.error(e);
    }
  };

  const isDataCustomized = useMemo(() => {
    return (
      stations.length !== INITIAL_STATIONS.length ||
      fareBrackets.length !== INITIAL_FARE_BRACKETS.length ||
      JSON.stringify(stations) !== JSON.stringify(INITIAL_STATIONS) ||
      JSON.stringify(fareBrackets) !== JSON.stringify(INITIAL_FARE_BRACKETS)
    );
  }, [stations, fareBrackets]);

  return (
    <TransitContext.Provider
      value={{
        modes,
        lines,
        stations,
        fareBrackets,
        selectedModeId,
        setSelectedModeId,
        startStationId,
        setStartStationId,
        endStationId,
        setEndStationId,
        routeResult,
        swapStations,
        clearSelection,

        isAdminAuthenticated,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        loginAdmin,
        logoutAdmin,

        addStation,
        updateStation,
        deleteStation,
        addFareBracket,
        updateFareBracket,
        deleteFareBracket,
        resetToDefaults,
        isDataCustomized,
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
