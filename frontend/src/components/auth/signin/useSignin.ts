import type { UseFormSetError } from "react-hook-form";
import type { SignInValues } from "../../../schemas/AuthSchema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useSignin = (setError: UseFormSetError<SignInValues>) => {
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: SignInValues) => {
      const response = await api.post("/auth/sign-in", data);
      if (response.data.success) {
        const jwtToken = response.data.message;

        localStorage.setItem("token", jwtToken);
        navigate("/dashboard");
      }
      toast("Welcome to Drawboard", {
        position: "top-right",
        duration: 2000,
      });
      return response.data;
    },
    onError: (error: AxiosError<any>) => {
      const message = error.response?.data.message;
      if (error.response?.status === 400) {
        Object.entries(message).forEach(([field, value]) => {
          if (Array.isArray(value)) {
            setError(field as keyof SignInValues, {
              type: "server",
              message: value[0],
            });
          }
        });
      } else {
        setServerError(
          error.response?.data.message ||
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
};
