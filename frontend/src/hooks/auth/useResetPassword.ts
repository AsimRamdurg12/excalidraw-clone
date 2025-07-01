import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import type { AxiosError } from "axios";

export function useResetPassword(email: string) {
  return useMutation({
    mutationFn: (newPassword: string) =>
      api.post("/auth/reset-password", { email, password: newPassword }),
    onError: (error: AxiosError) => {
      console.error("Reset Password Error:", error);
    },
  });
}
