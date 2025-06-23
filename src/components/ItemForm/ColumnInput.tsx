import React, { useState, memo } from 'react';
import { TextField, Dropdown, DatePicker } from '@vibe/core';
import moment from 'moment';
import { BoardColumn, mondayService } from '../../services/mondayService';
import { useForm } from '../../contexts';

interface ColumnInputProps {
  column: BoardColumn;
}

export const ColumnInput: React.FC<ColumnInputProps> = memo(({ column }) => {
  const { state, setField } = useForm();
  const [error, setError] = useState<string>('');

  const value = state.formData[column.id] || '';

  const validateInput = (
    inputValue: string | number | boolean | null,
    columnType: string
  ): string => {
    if (!inputValue && columnType !== 'date') return '';

    switch (columnType) {
      case 'numbers':
        if (inputValue && isNaN(Number(inputValue))) {
          return 'Please enter a valid number';
        }
        break;
      case 'text':
        if (typeof inputValue === 'string' && inputValue.length > 500) {
          return 'Text must be less than 500 characters';
        }
        break;
      case 'date':
        if (inputValue && !isValidDate(inputValue as string)) {
          return 'Please enter a valid date';
        }
        break;
    }
    return '';
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleChange = (newValue: string | number | boolean | null) => {
    const validationError = validateInput(newValue, column.type);
    setError(validationError);

    if (!validationError) {
      setField(column.id, newValue);
    }
  };

  const renderInput = () => {
    switch (column.type) {
      case 'text':
        return (
          <TextField
            title={column.title}
            placeholder={`Enter ${column.title.toLowerCase()}...`}
            value={(value as string) || ''}
            onChange={handleChange}
            size="medium"
            validation={error ? { status: 'error', text: error } : undefined}
            className="w-full"
          />
        );

      case 'numbers':
        return (
          <TextField
            title={column.title}
            placeholder={`Enter ${column.title.toLowerCase()}...`}
            type="number"
            value={(value as string) || ''}
            onChange={(val) => handleChange(val ? parseFloat(val) : null)}
            size="medium"
            validation={error ? { status: 'error', text: error } : undefined}
            className="w-full"
          />
        );

      case 'status': {
        const statusOptions = column?.settings_str
          ? mondayService.getStatusOptions(column.settings_str)
          : [];

        const dropdownOptions = statusOptions.map((option) => ({
          label: option.label,
          value: option.index.toString(),
        }));

        return (
          <div className="w-full relative z-[9999]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {column.title}
            </label>
            <Dropdown
              placeholder={`Select ${column.title.toLowerCase()}...`}
              options={dropdownOptions}
              value={
                value
                  ? dropdownOptions.find((option) => option.value === value)
                  : null
              }
              onChange={handleChange}
              size="medium"
              className={`w-full ${error ? 'border-red-500' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      }

      case 'date':
        return (
          <div className="w-full relative z-50">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {column.title}
            </label>
            <DatePicker
              date={value ? moment(value as string) : undefined}
              onPickDate={(date) => {
                if (date && typeof date === 'object' && 'format' in date) {
                  handleChange(date.format('YYYY-MM-DD'));
                } else if (date instanceof Date) {
                  handleChange(date.toISOString().split('T')[0]);
                } else {
                  handleChange(null);
                }
              }}
              className={`w-full ${error ? 'border-red-500' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <TextField
            title={column.title}
            placeholder={`Enter ${column.title.toLowerCase()}...`}
            value={(value as string) || ''}
            onChange={handleChange}
            size="medium"
            validation={error ? { status: 'error', text: error } : undefined}
            className="w-full"
          />
        );
    }
  };

  return <div className="w-full">{renderInput()}</div>;
});

ColumnInput.displayName = 'ColumnInput';
