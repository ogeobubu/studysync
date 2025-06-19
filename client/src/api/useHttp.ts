import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { http } from "./http";
import toast from "react-hot-toast";
import axios from "axios";
import type { HttpMethod, HttpTypes } from "../types/index.ts";

// === Overloads ===
export function useHttp<TResponse>(args: {
  url: string;
  method?: "GET";
  options?: HttpTypes<TResponse>["options"];
}): UseQueryResult<TResponse>;

export function useHttp<TResponse, TPayload>(args: {
  url: string;
  method: Exclude<HttpMethod, "GET">;
  options?: HttpTypes<TResponse, TPayload>["options"];
}): UseMutationResult<TResponse, unknown, TPayload>;

// === Implementation ===
export function useHttp<TResponse, TPayload = unknown>({
  url,
  method = "GET",
  options = {},
}: HttpTypes<TResponse, TPayload>) {
  const queryClient = useQueryClient();

  const commonOptions = {
    onError: handleError,
    ...options,
  };

  if (method === "GET") {
    return useQuery<TResponse>({
      queryKey: [url],
      queryFn: () => http.get<TResponse>(url).then((res) => res.data),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      ...commonOptions,
    });
  }

  const mutationMap: Record<
    Exclude<HttpMethod, "GET">,
    (data: TPayload) => Promise<TResponse>
  > = {
    POST: (data: TPayload) =>
      http.post<TResponse>(url, data).then((res) => res.data),
    PATCH: (data: TPayload) =>
      http.patch<TResponse>(url, data).then((res) => res.data),
    PUT: (data: TPayload) =>
      http.put<TResponse>(url, data).then((res) => res.data),
    DELETE: (_: TPayload) =>
      http.delete<TResponse>(url).then((res) => res.data),
  };

  const mutationFn = mutationMap[method as Exclude<HttpMethod, "GET">];

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [url] });
      options?.onSuccess?.(data);
    },
    ...commonOptions,
  });
}

const handleError = (error: unknown) => {

  if (axios.isAxiosError(error)) {
    // Check if the request was aborted due to timeout
    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please try again.");
      return;
    }

    // Access the error message safely via optional chaining
    const message =
      error.response?.data?.data?.message || error.response?.data?.data?.error ||
      (error.message
        ? error.message
        : "An error occurred. Please try again later.");

    toast.error(message);
  } else if (error instanceof Error) {
    // Fallback for non-Axios errors (standard Error instances)
    toast.error(error.message || "An error occurred. Please try again later.");
  } else {
    // Generic fallback if error shape is unknown
    toast.error("An error occurred. Please try again later.");
  }
};
