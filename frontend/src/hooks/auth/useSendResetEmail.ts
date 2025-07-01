import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import type { AxiosError } from "axios";

export function useSendResetEmail(onSuccess: () => void) {
  return useMutation({
    mutationFn: (email: string) => api.post("/auth/send-email", { email }),
    onSuccess: () => onSuccess(),
    onError: (error: AxiosError) => {
      console.error("Send Email Error:", error);
    },
  });
}
