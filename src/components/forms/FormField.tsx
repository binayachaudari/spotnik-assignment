import React, { memo } from 'react';
import { TextField } from '@vibe/core';
import { useForm } from '../../contexts';

interface FormFieldProps {
  name: string;
  title: string;
  type?: 'text' | 'number';
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = memo(
  ({
    name,
    title,
    type = 'text',
    placeholder,
    required = false,
    className = 'w-full',
  }) => {
    const { state, setField } = useForm();
    const value = state.formData[name] || '';
    const error = state.errors[name];

    const handleChange = (newValue: string) => {
      const processedValue =
        type === 'number' && newValue ? parseFloat(newValue) : newValue;
      setField(name, processedValue);
    };

    return (
      <div className={className}>
        <TextField
          title={title}
          placeholder={placeholder || `Enter ${title.toLowerCase()}...`}
          value={String(value)}
          onChange={handleChange}
          required={required}
          type={type}
          size="medium"
          validation={error ? { status: 'error', text: error } : undefined}
          className="w-full"
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';
