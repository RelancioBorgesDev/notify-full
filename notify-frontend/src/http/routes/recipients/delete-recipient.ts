import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DeleteRecipientResponse } from "@/http/types/recipients/delete-recipient-response";
import { queryClient } from "@/App";

export function useDeleteRecipient(recipientId: string) {
  return useMutation<DeleteRecipientResponse, Error, void>({
    mutationKey: ["delete-recipient", recipientId],
    mutationFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/recipients/delete/${recipientId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response.status === 204) {
          return {
            message: "Destinatário deletado com sucesso",
          } as DeleteRecipientResponse;
        }

        const result: DeleteRecipientResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao deletar o destinatário: ", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
