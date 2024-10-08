import axios from "axios";

export const ARCHITECTON_API_FQDN = import.meta.env.VITE_ARCHITECTON_API_FQDN;

const axiosInstance = axios.create({
  baseURL: `${ARCHITECTON_API_FQDN}/api/v2/node`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
