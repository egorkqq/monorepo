import axios from "axios";

export const ARCHITECTON_NODE_API_FQDN = import.meta.env.DEV ? "/api" : "https://tonb.architecton.site";
// Testnet: "https://dev.architecton.site";

const nodeAxiosInstance = axios.create({
  baseURL: `${ARCHITECTON_NODE_API_FQDN}/api/v2/node`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default nodeAxiosInstance;
