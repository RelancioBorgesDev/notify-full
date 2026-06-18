import { useQuery } from "@tanstack/react-query";
import type { GetRecipientResponse } from "@/http/types/recipients/get-recipient-response";

export function useGetRecipientById(recipientId: string) {
  return useQuery({
    queryKey: ["recipient", recipientId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/recipients/${recipientId}`,
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

        const result: GetRecipientResponse = await response.json();

        return result.recipient;
      } catch (error) {
        console.error("Erro ao buscar destinatário:", error);
        throw error;
      }
    },
  });
}
