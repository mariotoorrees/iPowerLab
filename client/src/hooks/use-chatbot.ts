import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ChatMessage, InsertChatMessage } from "@shared/schema";

// Hook to fetch chat messages
export function useChatMessages(userId: number, limit?: number) {
  const queryParams = limit ? `?limit=${limit}` : "";
  return useQuery<ChatMessage[]>({
    queryKey: [`/api/users/${userId}/chat${queryParams}`],
  });
}

// Hook to send a message
export function useSendMessage() {
  return useMutation({
    mutationFn: async (message: InsertChatMessage) => {
      const res = await apiRequest("POST", "/api/chat", message);
      return res.json();
    },
    onSuccess: (data, variables) => {
      // We expect data to be an array with user message and AI response
      if (Array.isArray(data)) {
        // Update the chat messages in the cache
        queryClient.setQueryData<ChatMessage[]>(
          [`/api/users/${variables.userId}/chat`],
          (oldData = []) => [...oldData, ...data]
        );
      } else {
        // Handle single message case
        queryClient.setQueryData<ChatMessage[]>(
          [`/api/users/${variables.userId}/chat`],
          (oldData = []) => [...oldData, data]
        );
      }
    },
  });
}
