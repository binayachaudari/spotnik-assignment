import React from 'react';
import { Heading } from '@vibe/core';

interface ErrorMessageProps {
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
}) => {
  const colorClasses = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  return (
    <div className="p-8 max-w-2xl">
      <Heading type="h2" className={`mb-4 ${colorClasses[type]}`}>
        {title}
      </Heading>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
