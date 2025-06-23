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
