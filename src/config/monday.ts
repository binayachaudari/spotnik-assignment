export const MONDAY_CONFIG = {
  API_TOKEN: import.meta.env.VITE_MONDAY_API_KEY,
  BOARD_ID: import.meta.env.VITE_MONDAY_BOARD_ID,
} as const;

export const COLUMN_TYPES = {
  NAME: 'name',
  TEXT: 'text',
  NUMBERS: 'numbers', 
  STATUS: 'status',
  DATE: 'date'
} as const; 
