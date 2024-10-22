import type { UseMutationResult } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";
import { type AxiosError, type AxiosResponse } from "axios";
import { useSetAtom } from "jotai";

import axiosInstance from "@/api/architecton";
import { authTokenAtom } from "@/atoms/user";

interface AuthRequest {
  initDataRaw?: string;
  authType: "telegram" | "web";
  initTon?: {
    network: string;
    address: string;
    publicKey?: string;
    signature?: string;
  };
}

interface AuthResponse {
  access_token: string;
}

export const useAuth = (): UseMutationResult<AuthResponse, AxiosError, AuthRequest> => {
  const setAuthToken = useSetAtom(authTokenAtom);

  return useMutation<AuthResponse, AxiosError, AuthRequest>({
    mutationFn: async (credentials) => {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post<AuthResponse>("/auth", credentials);

      return response.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.access_token);
    },
    onError: () => {
      toast.error(
        "Authentication was unsuccessful. You may experience limited functionality. We apologize for the inconvenience and encourage you to try again.",
        { id: "auth-error" },
      );
    },
  });
};
