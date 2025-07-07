import { api } from "../lib/axios";
import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

const useProfile = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/get-user");
        const result = await response.data;

        if (!result.success) throw new Error(response.data.message);

        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message);
      }
    },
    retry: false,
    retryOnMount: false,
  });

  return { user, isLoading, isError };
};

export default useProfile;
