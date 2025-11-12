import type { AxiosError } from "axios";

export type FriendlyError = {
  message: string;
  status?: number;
};

export function handleError(err: unknown): FriendlyError {
  // Axios error shape
  const axiosErr = err as AxiosError<any>;
  const status = axiosErr?.response?.status;
  const data: any = axiosErr?.response?.data;

  if (data?.message) {
    return { message: data.message, status };
  }
  if (status === 401) return { message: "Unauthorized. Please login again.", status };
  if (status === 403) return { message: "Forbidden. You don't have access.", status };
  if (status === 400) return { message: "Invalid request. Please check your input.", status };
  if (status && status >= 500) return { message: "Server error. Please try later.", status };

  // Network or unknown
  if (axiosErr?.message === "Network Error") {
    return { message: "Network error. Check your connection." };
  }
  return { message: "Something went wrong. Please try again." };
}
