import axios from "axios";

export const ARCHITECTON_NODE_TESTNET_API_FQDN = "https://dev.architecton.site";
export const ARCHITECTON_NODE_MAINNET_API_FQDN = import.meta.env.DEV ? "/api" : "https://tonb.architecton.site";

const nodeAxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default nodeAxiosInstance;

export const getArcNodeBaseUrl = (network: "mainnet" | "testnet") =>
  network === "mainnet" ? ARCHITECTON_NODE_MAINNET_API_FQDN : ARCHITECTON_NODE_TESTNET_API_FQDN;
