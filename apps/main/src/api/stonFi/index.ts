import axios from "axios";

const stonFiAxios = axios.create({
  baseURL: "https://api.ston.fi/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default stonFiAxios;
