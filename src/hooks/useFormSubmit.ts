import { useCreateItem } from './useMondayData';
import { useForm, useApp, FormData } from '../contexts';
import { useToast } from './useToast';
import { BoardColumn } from '../services/mondayService';

export const useFormSubmit = (boardId: string) => {
  const {
    state: formState,
    resetForm,
    setSubmitting,
    validateForm,
  } = useForm();
  const { setError } = useApp();
  const toast = useToast();
  const createItemMutation = useCreateItem();

  const handleSubmit = async (e: React.FormEvent, columns: BoardColumn[]) => {
    e.preventDefault();

    // Validate form
    if (!validateForm(columns)) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare column values
      const column_values = columns
        .filter(
          (col) =>
            col.type !== 'name' &&
            formState.formData[col.id] !== undefined &&
            formState.formData[col.id] !== ''
        )
        .map((col) => ({
          id: col.id,
          value: formState.formData[col.id],
          type: col.type,
        }));

      // Submit form
      await createItemMutation.mutateAsync({
        boardId,
        payload: {
          item_name: formState.formData.item_name,
          column_values,
        },
      });

      // Success handling
      toast.success(
        `Item '${formState.formData.item_name}' created successfully! 🎉`
      );

      // Reset form
      const resetData: FormData = { item_name: '' };
      columns.forEach((col) => {
        if (col.type !== 'name') {
          resetData[col.id] = '';
        }
      });
      resetForm(resetData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create item';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting: formState.isSubmitting || createItemMutation.isPending,
    canSubmit: !!formState.formData.item_name.trim() && !formState.isSubmitting,
  };
};
