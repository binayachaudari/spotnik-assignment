// GraphQL Mutations for Monday.com API

export const CREATE_ITEM = (
  boardId: string,
  itemName: string,
  columnValuesJson: string
) => `
  mutation {
    create_item (
      board_id: ${boardId}
      item_name: "${itemName}"
      column_values: "${columnValuesJson.replace(/"/g, '\\"')}"
    ) {
      id
      name
      column_values {
        id
        text
      }
    }
  }
`;

export const UPDATE_ITEM = (itemId: string, columnValuesJson: string) => `
  mutation {
    change_multiple_column_values (
      item_id: ${itemId}
      board_id: null
      column_values: "${columnValuesJson.replace(/"/g, '\\"')}"
    ) {
      id
      name
      column_values {
        id
        text
      }
    }
  }
`;

export const DELETE_ITEM = (itemId: string) => `
  mutation {
    delete_item (item_id: ${itemId}) {
      id
    }
  }
`;

export const DUPLICATE_ITEM = (boardId: string, itemId: string) => `
  mutation {
    duplicate_item (
      board_id: ${boardId}
      item_id: ${itemId}
    ) {
      id
      name
      column_values {
        id
        text
      }
    }
  }
`;
