import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateRecipientRequest } from "@/http/types/recipients/create-recipient-request";
import type { CreateRecipientResponse } from "@/http/types/recipients/create-recipient-response";
import { queryClient } from "@/App";

export function useCreateRecipient() {
  return useMutation({
    mutationKey: ["create-recipient"],
    mutationFn: async (recipientData: CreateRecipientRequest) => {
      try {
        const response = await fetch(
          "http://localhost:3333/recipients/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(recipientData),
          }
        );

        if (!(response.status === 201)) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const result: CreateRecipientResponse = await response.json();
        return result;
      } catch (error) {
        console.error("Erro ao criar o destinatário: ", error);
        throw error;
      }
    },
    onSuccess: (data: CreateRecipientResponse) => {
      const { message } = data;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
