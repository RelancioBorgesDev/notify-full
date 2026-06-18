import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTemplateResponse } from "@/http/types/templates/create-template-response";
import { queryClient } from "@/App";
import type { CreateTemplateRequest } from "@/http/types/templates/create-template-request";

export function useCreateTemplate() {
  return useMutation({
    mutationKey: ["create-template"],
    mutationFn: async (templateData: CreateTemplateRequest) => {
      try {
        const response = await fetch(
          "http://localhost:3333/notification/template",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(templateData),
          }
        );

        if (!(response.status === 201)) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const result: CreateTemplateResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao criar o template: ", error);
        throw error;
      }
    },
    onSuccess: (data: CreateTemplateResponse) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
