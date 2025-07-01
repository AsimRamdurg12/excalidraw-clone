import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/axios";
import { AxiosError } from "axios";
import type { SignUpValues } from "../../../schemas/AuthSchema";
import type { UseFormSetError } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

export function useSignUp(setError: UseFormSetError<SignUpValues>) {
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: SignUpValues) => {
      const response = await api.post("/auth/sign-up", data);
      toast("sign up successful. Sign In to enter Drawboard", {
        position: "top-right",
        duration: 2000,
      });
      return response.data;
    },
    onError: (error: AxiosError<any>) => {
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        Object.entries(message).forEach(([field, value]) => {
          if (Array.isArray(value)) {
            setError(field as keyof SignUpValues, {
              type: "server",
              message: value[0],
            });
          }
        });
      } else {
        setServerError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    serverError,
  };
}
