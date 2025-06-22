import React, { useState } from 'react';
import { Button, Heading, TextField, Toast, Loader } from '@vibe/core';
import { MONDAY_CONFIG } from '../../config/monday';
import { useBoardColumns, useCreateItem } from '../../hooks';
import { ColumnInput } from './ColumnInput.tsx';

interface FormData {
  item_name: string;
  [key: string]: string | number | boolean | null;
}

export const ItemForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ item_name: '' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [createdItemName, setCreatedItemName] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch board columns and info using custom hook
  const { data: boardData, isLoading: columnsLoading } = useBoardColumns(
    MONDAY_CONFIG.BOARD_ID
  );

  const boardName = boardData?.boardName || 'Monday Board';
  const columns = boardData?.columns || [];

  // Create item mutation using custom hook
  const createItemMutation = useCreateItem();

  // Filter columns to show only supported types
  const supportedColumns = columns.filter((col) =>
    ['name', 'text', 'numbers', 'status', 'date'].includes(col.type)
  );

  const handleInputChange = (
    columnId: string,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate item name
    if (!formData.item_name.trim()) {
      errors.item_name = 'Item name is required';
    }

    // Validate required columns (you can customize this based on your needs)
    supportedColumns
      .filter((col) => col.type !== 'name')
      .forEach((col) => {
        const value = formData[col.id];
        if (col.type === 'numbers' && value && isNaN(Number(value))) {
          errors[col.id] = `${col.title} must be a valid number`;
        }
      });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(formData);

    const column_values = supportedColumns
      .filter(
        (col) =>
          col.type !== 'name' &&
          formData[col.id] !== undefined &&
          formData[col.id] !== ''
      )
      .map((col) => ({
        id: col.id,
        value: formData[col.id],
        type: col.type,
      }));

    createItemMutation.mutate(
      {
        boardId: MONDAY_CONFIG.BOARD_ID,
        payload: {
          item_name: formData.item_name,
          column_values,
        },
      },
      {
        onSuccess: () => {
          setCreatedItemName(formData.item_name);
          setShowSuccessToast(true);
          const resetFormData: FormData = { item_name: '' };
          supportedColumns.forEach((col) => {
            if (col.type !== 'name') {
              resetFormData[col.id] = '';
            }
          });
          console.log(resetFormData);
          setFormData(resetFormData);
          setFormErrors({});
        },
      }
    );
  };

  if (!MONDAY_CONFIG.API_TOKEN || !MONDAY_CONFIG.BOARD_ID) {
    return (
      <div className="p-8 max-w-2xl">
        <Heading type="h2" className="mb-4 text-red-600">
          Configuration Required
        </Heading>
        <p className="text-gray-600">
          Please update your API token and Board ID in src/config/monday.ts
        </p>
      </div>
    );
  }

  return columnsLoading ? (
    <Loader size="medium" />
  ) : (
    <div className="p-8 max-w-2xl">
      <Heading type="h1" className="mb-2">
        Create New Item
      </Heading>
      <p className="text-gray-600 mb-6">
        Add a new item to <strong className="text-gray-800">{boardName}</strong>{' '}
        board
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Item Name Field - Full Width */}
          <div className="w-full">
            <TextField
              title="Item Name"
              placeholder="Enter item name..."
              value={formData.item_name}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, item_name: value }))
              }
              required
              size="medium"
              validation={
                formErrors.item_name
                  ? { status: 'error', text: formErrors.item_name }
                  : undefined
              }
              className="w-full"
            />
          </div>

          {/* Dynamic Column Fields - Equal Width Grid */}
          <div className="w-full flex flex-col gap-4">
            {supportedColumns
              .filter((col) => col.type !== 'name')
              .map((column) => (
                <ColumnInput
                  key={column.id}
                  column={column}
                  value={formData[column.id]}
                  onChange={(value: string | number | boolean | null) =>
                    handleInputChange(column.id, value)
                  }
                />
              ))}
          </div>

          <Button
            type="submit"
            kind="secondary"
            size="large"
            loading={createItemMutation.isPending}
            disabled={!formData.item_name.trim()}
          >
            {createItemMutation.isPending ? 'Creating...' : 'Create Item'}
          </Button>
        </div>
      </form>

      {showSuccessToast && (
        <Toast
          open={showSuccessToast}
          type="positive"
          onClose={() => setShowSuccessToast(false)}
        >
          {`Item '${createdItemName}' created successfully! 🎉`}
        </Toast>
      )}
    </div>
  );
};
