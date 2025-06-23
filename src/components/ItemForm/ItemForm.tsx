import React from 'react';
import { Heading } from '@vibe/core';
import { FormProvider, useApp } from '../../contexts';
import { useBoardColumns, useFormSubmit } from '../../hooks';
import { LoadingSpinner, ErrorMessage, ToastNotification } from '../ui';
import { FormField, FormActions } from '../forms';
import { ColumnInput } from './ColumnInput';
import { MONDAY_CONFIG } from '../../config/monday';

// Inner component that uses the contexts
const ItemFormContent: React.FC = () => {
  const { state: appState } = useApp();

  // Fetch board data
  const { data: boardData, isLoading: columnsLoading } = useBoardColumns(
    MONDAY_CONFIG.BOARD_ID
  );

  const boardName = boardData?.boardName || 'Monday Board';
  const columns = boardData?.columns || [];

  // Form submission logic
  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmit(
    MONDAY_CONFIG.BOARD_ID
  );

  // Filter supported columns
  const supportedColumns = columns.filter((col) =>
    ['name', 'text', 'numbers', 'status', 'date'].includes(col.type)
  );

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, supportedColumns);
  };

  // Configuration check
  if (!MONDAY_CONFIG.API_TOKEN || !MONDAY_CONFIG.BOARD_ID) {
    return (
      <ErrorMessage
        title="Configuration Required"
        message="Please update your API token and Board ID in src/config/monday.ts"
      />
    );
  }

  // Loading state
  if (columnsLoading) {
    return <LoadingSpinner message="Loading board information..." />;
  }

  // Error state
  if (appState.error) {
    return <ErrorMessage title="Error" message={appState.error} />;
  }

  return (
    <>
      <div className="p-8 max-w-2xl">
        <Heading type="h1" className="mb-2">
          Create New Item
        </Heading>
        <p className="text-gray-600 mb-6">
          Add a new item to{' '}
          <strong className="text-gray-800">{boardName}</strong> board
        </p>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Item Name Field */}
            <FormField
              name="item_name"
              title="Item Name"
              placeholder="Enter item name..."
              required
            />

            {/* Dynamic Column Fields */}
            <div className="flex flex-col gap-4">
              {supportedColumns
                .filter((col) => col.type !== 'name')
                .map((column) => (
                  <ColumnInput key={column.id} column={column} />
                ))}
            </div>

            {/* Submit Button */}
            <FormActions
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              submitLabel="Create Item"
              onSubmit={onSubmit}
            />
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastNotification />
    </>
  );
};

// Main component with context providers
export const ItemForm: React.FC = () => {
  return (
    <FormProvider>
      <ItemFormContent />
    </FormProvider>
  );
};
