import { useQuery } from "@tanstack/react-query";
import type { ListTemplatesResponse } from "@/http/types/templates/list-templates";

export function useListTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:3333/notification/template/list",
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

        const result: ListTemplatesResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao listar os templates: ", error);
        throw error;
      }
    },
  });
}
