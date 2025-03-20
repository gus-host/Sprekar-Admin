import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data.message ||
      error.response?.data.error ||
      "An unknown error occurred";
    throw new Error(errorMessage);
  }
  throw error;
};
