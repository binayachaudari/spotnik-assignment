// GraphQL Queries for Monday.com API

export const GET_BOARD_COLUMNS = (boardId: string) => `
  query {
    boards (ids: [${boardId}]) {
      id
      name
      columns {
        id
        title
        type
        settings_str
      }
    }
  }
`;

export const GET_BOARD_INFO = (boardId: string) => `
  query {
    boards (ids: [${boardId}]) {
      id
      name
      description
      state
      columns {
        id
        title
        type
        settings_str
      }
    }
  }
`;

export const GET_BOARD_ITEMS = (boardId: string, limit: number = 25) => `
  query {
    boards (ids: [${boardId}]) {
      items_page (limit: ${limit}) {
        items {
          id
          name
          column_values {
            id
            text
            value
          }
        }
      }
    }
  }
`;
