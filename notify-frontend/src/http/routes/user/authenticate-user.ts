import { useMutation } from "@tanstack/react-query";
import type { AuthenticateUserRequest } from "../../types/user/authenticate-user-request";
import { toast } from "sonner";

export function useAuthenticateUser() {
  return useMutation<string, Error, AuthenticateUserRequest>({
    mutationKey: ["authenticate-user"],
    mutationFn: async (userData: AuthenticateUserRequest) => {
      const response = await fetch("http://localhost:3333/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (response.status === 404) {
        throw new Error("Usuário não encontrado");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao autenticar o usuário.");
      }

      const { message } = await response.json();
      return message;
    },
    onSuccess: (message: string) => {
      toast.success(message);
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
