import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BoardColumn } from '../services/mondayService';

// Form Data Types
export interface FormData {
  item_name: string;
  [key: string]: string | number | boolean | null;
}

export interface FormErrors {
  [key: string]: string;
}

// State Types
interface FormState {
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Action Types
type FormAction =
  | {
      type: 'SET_FIELD';
      payload: { field: string; value: string | number | boolean | null };
    }
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM'; payload?: FormData }
  | { type: 'SET_FORM_DATA'; payload: FormData };

// Initial State
const initialFormData: FormData = { item_name: '' };

const initialState: FormState = {
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  isDirty: false,
};

// Reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
        isDirty: true,
        // Clear field-specific error when user starts typing
        errors: {
          ...state.errors,
          [action.payload.field]: '',
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        formData: action.payload || initialFormData,
      };
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
        isDirty: true,
      };
    default:
      return state;
  }
};

// Context Type
interface FormContextType {
  state: FormState;
  setField: (field: string, value: string | number | boolean | null) => void;
  setErrors: (errors: FormErrors) => void;
  setSubmitting: (submitting: boolean) => void;
  resetForm: (initialData?: FormData) => void;
  validateForm: (columns: BoardColumn[]) => boolean;
}

// Create Context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider Component
interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (field: string, value: string | number | boolean | null) => {
    dispatch({ type: 'SET_FIELD', payload: { field, value } });
  };

  const setErrors = (errors: FormErrors) => {
    dispatch({ type: 'SET_ERRORS', payload: errors });
  };

  const setSubmitting = (submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  };

  const resetForm = (initialData?: FormData) => {
    dispatch({ type: 'RESET_FORM', payload: initialData });
  };

  // Validation Logic
  const validateForm = (columns: BoardColumn[]): boolean => {
    const errors: FormErrors = {};

    // Validate item name
    if (!state.formData.item_name.trim()) {
      errors.item_name = 'Item name is required';
    }

    // Validate other columns
    columns
      .filter((col) => col.type !== 'name')
      .forEach((col) => {
        const value = state.formData[col.id];

        if (col.type === 'numbers' && value && isNaN(Number(value))) {
          errors[col.id] = `${col.title} must be a valid number`;
        }

        if (
          col.type === 'text' &&
          typeof value === 'string' &&
          value.length > 500
        ) {
          errors[col.id] = `${col.title} must be less than 500 characters`;
        }
      });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const value: FormContextType = {
    state,
    setField,
    setErrors,
    setSubmitting,
    resetForm,
    validateForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Custom Hook
export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
