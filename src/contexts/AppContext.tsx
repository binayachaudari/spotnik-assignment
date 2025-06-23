import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MONDAY_CONFIG } from '../config/monday';

// State Types
interface AppState {
  isLoading: boolean;
  error: string | null;
  config: typeof MONDAY_CONFIG;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

// Action Types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SHOW_TOAST';
      payload: { message: string; type: 'success' | 'error' | 'info' };
    }
  | { type: 'HIDE_TOAST' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
  isLoading: false,
  error: null,
  config: MONDAY_CONFIG,
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          show: true,
          message: action.payload.message,
          type: action.payload.type,
        },
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: { ...state.toast, show: false },
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// Context Type
interface AppContextType {
  state: AppState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  resetState: () => void;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const value: AppContextType = {
    state,
    setLoading,
    setError,
    showToast,
    hideToast,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
