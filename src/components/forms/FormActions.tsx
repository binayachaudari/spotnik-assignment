import React, { memo } from 'react';
import { Button } from '@vibe/core';

interface FormActionsProps {
  isSubmitting: boolean;
  canSubmit: boolean;
  submitLabel?: string;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = memo(
  ({
    isSubmitting,
    canSubmit,
    submitLabel = 'Submit',
    onSubmit,
    className = '',
  }) => (
    <div className={`flex gap-4 ${className}`}>
      <Button
        type="submit"
        kind="secondary"
        size="large"
        className="w-full"
        loading={isSubmitting}
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        {isSubmitting ? 'Processing...' : submitLabel}
      </Button>
    </div>
  )
);

FormActions.displayName = 'FormActions';
