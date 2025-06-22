import mondaySDK from 'monday-sdk-js';
import { MONDAY_CONFIG } from '../config/monday';
import { GET_BOARD_COLUMNS, CREATE_ITEM } from '../graphql';

// Initialize Monday SDK
const monday = mondaySDK();
monday.setToken(MONDAY_CONFIG.API_TOKEN);

export interface ColumnValue {
  id: string;
  value: string | number | boolean | null;
  type: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  type: string;
  settings_str?: string;
}

export interface CreateItemPayload {
  item_name: string;
  column_values: ColumnValue[];
}

export interface StatusOption {
  index: number;
  label: string;
}

export interface BoardColumnsResponse {
  boardName: string;
  columns: BoardColumn[];
}

export class MondayService {
  // Get board columns and info
  async getBoardColumns(boardId: string): Promise<BoardColumnsResponse> {
    try {
      const query = GET_BOARD_COLUMNS(boardId);
      const response = await monday.api(query);
      const board = response.data.boards[0];
      return {
        boardName: board?.name || 'Unknown Board',
        columns: board?.columns || [],
      };
    } catch (error) {
      console.error('Error fetching board columns:', error);
      throw error;
    }
  }

  // Get status options for a status column
  getStatusOptions(settingsStr: string): StatusOption[] {
    try {
      const settings = JSON.parse(settingsStr);

      // Handle the case where labels is an object with keys
      if (settings.labels && typeof settings.labels === 'object') {
        return Object.entries(settings.labels).map(
          ([key, value]: [string, unknown]) => {
            const statusValue = value as {
              title?: string;
              name?: string;
            };
            return {
              index: parseInt(key),
              label: statusValue.title || statusValue.name || String(value),
            };
          }
        );
      }

      // Fallback for array format
      return settings.labels || [];
    } catch (error) {
      console.error('Error parsing status settings:', error);
      return [];
    }
  }

  // Create a new item
  async createItem(
    boardId: string,
    payload: CreateItemPayload
  ): Promise<unknown> {
    try {
      const columnValuesJson = JSON.stringify(
        payload.column_values.reduce((acc, col) => {
          acc[col.id] = col.value;
          return acc;
        }, {} as Record<string, string | number | boolean | null>)
      );

      const query = CREATE_ITEM(boardId, payload.item_name, columnValuesJson);
      const response = await monday.api(query);
      return response.data.create_item;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }
}

export const mondayService = new MondayService();
