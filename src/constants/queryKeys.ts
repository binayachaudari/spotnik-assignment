export const QUERY_KEYS = {
  BOARD_COLUMNS: (boardId: string) => ['board-columns', boardId],
  BOARDS: 'boards',
  ITEMS: 'items',
} as const;

export const MUTATION_KEYS = {
  CREATE_ITEM: 'create-item',
  UPDATE_ITEM: 'update-item',
  DELETE_ITEM: 'delete-item',
} as const;
