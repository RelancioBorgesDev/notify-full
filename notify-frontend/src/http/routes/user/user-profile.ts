import type { MeResponse } from "@/http/types/user/me-response";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3333/users/me", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Não autorizado");
      }

      const data: MeResponse = await res.json();
      return data;
    },
  });
}
