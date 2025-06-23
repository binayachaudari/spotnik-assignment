import React from 'react';
import { Toast } from '@vibe/core';
import { useToast } from '../../hooks';

export const ToastNotification: React.FC = () => {
  const toast = useToast();

  if (!toast.show) return null;

  return (
    <Toast
      open={toast.show}
      type={
        toast.type === 'success'
          ? 'positive'
          : toast.type === 'error'
          ? 'negative'
          : 'normal'
      }
      onClose={toast.hide}
    >
      {toast.message}
    </Toast>
  );
};
