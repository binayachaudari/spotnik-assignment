import { useApp } from '../contexts';

export const useToast = () => {
  const { state, showToast, hideToast } = useApp();

  const toast = {
    ...state.toast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
    hide: hideToast,
  };

  return toast;
};
