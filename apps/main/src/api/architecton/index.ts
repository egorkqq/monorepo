import axios from "axios";
import { getDefaultStore } from "jotai";

import { authTokenAtom } from "@/atoms/user";

export const ARCHITECTON_API_FQDN = import.meta.env.VITE_ARCHITECTON_API_FQDN;

const axiosInstance = axios.create({
  baseURL: `${ARCHITECTON_API_FQDN}/api/v2/wallet`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    const store = getDefaultStore();
    const authToken = store.get(authTokenAtom);

    if (authToken) {
      newConfig.headers.Authorization = `Bearer ${authToken}`;
    }

    return newConfig;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
