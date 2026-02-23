import axios, { AxiosRequestConfig } from "axios";
import { ApiRequestConfig } from "../types/api.types";
import { getToken } from "../utils/cookies";
import { BASE_URL, PRIVATE_KEY } from "./api.constants";


export const callApi = async <T = any>({
  url,
  method = "GET",
  data,
  params,
  requiresAuth = false,
}: ApiRequestConfig): Promise<T> => {
  try {
    // Base headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Private-Key": PRIVATE_KEY, // your static key
    };

    // Include Bearer token if required
    if (requiresAuth) {
      const token = await getToken();
      console.log("Token:", getToken());
      if (!token) throw new Error("Auth token not found");
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Axios config
    const config: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url,
      method,
      headers,
      params,
      data,
      timeout: 10000, // 10s timeout
    };

    const response = await axios(config);
    console.log(response)
    return response.data;
  } catch (error: any) {
    console.dir(error); // for debugging
    console.log("Error Message:", error.message);
    console.log("Is Axios Error?:", axios.isAxiosError(error));

    // Check for CORS issues
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - token might be invalid or missing");
    } else if (!error.response) {
      console.error("Network or CORS issue detected");
    }

    throw error;
  }
};
