import React from 'react';
import { Loader } from '@vibe/core';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
}) => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader size={size} />
    {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
  </div>
);
