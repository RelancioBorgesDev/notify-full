import { useQuery } from "@tanstack/react-query";
import type { MeResponse } from "../../types/user/me-response";

export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/user/${userId}`,
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

        const result: MeResponse = await response.json();

        return result;
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
      }
    },
  });
}
