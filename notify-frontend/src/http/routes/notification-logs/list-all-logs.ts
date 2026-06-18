import { useQuery } from "@tanstack/react-query";
import type { ListAllLogsResponse } from "@/http/types/notification-logs/list-all-logs-response";

export function useListAllLogs() {
  return useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:3333/notification/logs/list",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!(response.status === 200)) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const result: ListAllLogsResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao listar os logs: ", error);
        throw error;
      }
    },
  });
}
