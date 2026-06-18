import { useQuery } from "@tanstack/react-query";
import type { GetTemplateResponse } from "@/http/types/templates/get-template-response";

export function useGetTemplateById(templateId: string) {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/notification/template/${templateId}`,
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

        const result: GetTemplateResponse = await response.json();

        return result.template;
      } catch (error) {
        console.error("Erro ao buscar template:", error);
        throw error;
      }
    },
  });
}
