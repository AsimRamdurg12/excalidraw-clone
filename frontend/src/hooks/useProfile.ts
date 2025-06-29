/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import type { AxiosError } from "axios";

interface Profile {
  name: string;
  photo?: string;
  email: string;
}

const useProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<unknown, any>>();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/get");

        if (!response.data || !response.data.success) {
          throw new Error(response.data.message);
        }
        const result = await response.data;
        setProfile(result.message);

        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [profile]);
  return { profile, error, loading };
};

export default useProfile;
