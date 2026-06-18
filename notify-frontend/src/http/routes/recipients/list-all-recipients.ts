import { useQuery } from "@tanstack/react-query";
import type { ListAllRecipientsResponse } from "@/http/types/recipients/list-all-recipients-response";

export function useListAllRecipients() {
  return useQuery({
    queryKey: ["recipients"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:3333/recipients/list`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.status !== 200) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const result: ListAllRecipientsResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao listar os destinatários: ", error);
        throw error;
      }
    },
  });
}
