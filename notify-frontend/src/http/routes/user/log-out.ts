import { useMutation } from "@tanstack/react-query";

export function useLogOut() {
  return useMutation<any, Error>({
    mutationKey: ["log-out"],
    mutationFn: async () => {
      const response = await fetch("http://localhost:3333/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erro ao sair");
      }
      await response.json();
    },
  });
}
