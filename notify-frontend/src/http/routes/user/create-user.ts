import { useMutation } from "@tanstack/react-query";
import type { CreateUserRequest } from "../../types/user/create-user-request";
import { toast } from "sonner";
import type { CreateUserResponse } from "../../types/user/create-user-response";

export function useCreateUser() {
  return useMutation<any, Error, CreateUserRequest>({
    mutationKey: ["create-user"],
    mutationFn: async (userData: CreateUserRequest) => {
      const response = await fetch("http://localhost:3333/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }
      const { message }: CreateUserResponse = await response.json();
      return message;
    },
    onSuccess: () => {
      toast.success("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: () => {
      toast.error("Não foi possível registar o usuário, tente novamente !");
    },
  });
}
