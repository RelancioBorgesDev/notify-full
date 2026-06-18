import { queryClient } from "@/App";
import type { UpdateTemplateRequest } from "@/http/types/templates/update-template-request";
import type { UpdateTemplateResponse } from "@/http/types/templates/update-template-response";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateTemplate() {
  return useMutation<UpdateTemplateResponse, Error, UpdateTemplateRequest>({
    mutationKey: ["update-template"],
    mutationFn: async ({ templateId, data }: UpdateTemplateRequest) => {
      const response = await fetch(
        `http://localhost:3333/notification/template/update/${templateId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const result: UpdateTemplateResponse = await response.json();
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
