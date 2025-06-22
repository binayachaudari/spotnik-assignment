import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mondayService, CreateItemPayload } from '../services/mondayService';
import { QUERY_KEYS } from '../constants/queryKeys';

// Hook for fetching board columns and info
export const useBoardColumns = (boardId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOARD_COLUMNS(boardId),
    queryFn: () => mondayService.getBoardColumns(boardId),
    enabled: !!boardId,
    select: (data) => ({
      boardName: data.boardName,
      columns: data.columns,
    }),
  });
};

// Hook for creating items
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      payload: CreateItemPayload;
    }) => {
      return mondayService.createItem(data.boardId, data.payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate board columns query to refresh data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOARD_COLUMNS(variables.boardId),
      });
    },
    onError: (error) => {
      console.error('Failed to create item:', error);
    },
  });
};
