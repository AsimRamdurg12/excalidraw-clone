import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import type { AxiosError } from "axios";

export function useVerifyOtp(email: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: (otp: string) => api.post("/auth/verify-otp", { email, otp }),
    onSuccess: () => onSuccess(),
    onError: (error: AxiosError) => {
      console.error("Verify OTP Error:", error);
    },
  });
}
