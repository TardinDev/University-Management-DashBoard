import dataProviderSimpleRest from "@refinedev/simple-rest";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  withCredentials: true,
});

export const dataProvider = dataProviderSimpleRest(API_URL, axiosInstance);
export default dataProvider;
