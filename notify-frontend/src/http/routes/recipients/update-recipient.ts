import { queryClient } from "@/App";
import type { UpdateRecipientRequest } from "@/http/types/recipients/update-recipient-request";
import type { UpdateRecipientResponse } from "@/http/types/recipients/update-recipient-response";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRecipient() {
  return useMutation<UpdateRecipientResponse, Error, UpdateRecipientRequest>({
    mutationKey: ["update-recipient"],
    mutationFn: async ({ recipientId, data }: UpdateRecipientRequest) => {
      const response = await fetch(
        `http://localhost:3333/recipients/update/${recipientId}`,
        {
          method: "PATCH",
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

      const result: UpdateRecipientResponse = await response.json();
      return result;
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
