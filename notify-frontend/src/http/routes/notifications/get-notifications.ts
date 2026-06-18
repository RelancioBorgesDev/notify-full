import { useQuery } from "@tanstack/react-query";
import type { GetNotificatonsResponse } from "../../types/notifications/get-notifications-response";

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:3333/notifications/list/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const result: GetNotificatonsResponse = await response.json();
        console.log(result.notifications);
        if (!result.notifications || !Array.isArray(result.notifications)) {
          console.warn(
            "API retornou notifications inválido, usando array vazio"
          );
          return [];
        }

        return result.notifications;
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
