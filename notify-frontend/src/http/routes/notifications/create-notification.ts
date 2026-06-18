import { useMutation } from "@tanstack/react-query";
import type {
  CreateNotificationRequest,
  CreateNotificationResponse,
} from "../../types/notifications/create-notification";
import { toast } from "sonner";
import { queryClient } from "@/App";

export function useCreateNotification() {
  return useMutation({
    mutationKey: ["create-notification"],
    mutationFn: async (notificationData: CreateNotificationRequest) => {
      try {
        const response = await fetch(
          "http://localhost:3333/notifications/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(notificationData),
          }
        );

        if (!(response.status === 201)) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const result: CreateNotificationResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao criar a notificação: ", error);
        throw error;
      }
    },
    onSuccess: (data: CreateNotificationResponse) => {
      const { message } = data;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
