import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/App";

type DeleteResponse = {
  message: string;
};

export function useDeleteTemplate(templateId: string) {
  return useMutation<DeleteResponse, Error, void>({
    mutationKey: ["delete-template", templateId],
    mutationFn: async () => {
      const response = await fetch(
        `http://localhost:3333/notification/template/${templateId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 204) {
        return { message: "Template deletado com sucesso" };
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao deletar template");
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
