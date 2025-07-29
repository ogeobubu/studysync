// client/src/api/useHttp.ts
import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import httpService from "./httpService";
import toast from "react-hot-toast";
import type { HttpMethod } from "../types";

interface UseHttpOptions<TResponse> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: any) => void;
}

// GET request overload - returns UseQueryResult
export function useHttp<TResponse>(args: {
  url: string;
  method?: "GET";
  options?: UseHttpOptions<TResponse>;
}): UseQueryResult<TResponse>;

// Non-GET request overload - returns UseMutationResult
export function useHttp<TResponse, TPayload = any>(args: {
  url: string;
  method: Exclude<HttpMethod, "GET">;
  options?: UseHttpOptions<TResponse>;
}): UseMutationResult<TResponse, unknown, TPayload>;

// Implementation
export function useHttp<TResponse, TPayload = any>({
  url,
  method = "GET",
  options = {},
}: {
  url: string;
  method?: HttpMethod;
  options?: UseHttpOptions<TResponse>;
}) {
  const queryClient = useQueryClient();

  // GET requests use useQuery
  if (method === "GET") {
    return useQuery<TResponse>({
      queryKey: [url],
      queryFn: async () => {
        try {
          const response = await httpService.get<TResponse>(url);
          return response.data;
        } catch (error) {
          // Don't show toast for query errors - let components handle them
          throw error;
        }
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      ...options,
    }) as UseQueryResult<TResponse>;
  }

  // Non-GET requests use useMutation
  const mutationFn = async (data: TPayload): Promise<TResponse> => {
    try {
      let response;
      
      switch (method) {
        case "POST":
          response = await httpService.post<TResponse>(url, data);
          break;
        case "PUT":
          response = await httpService.put<TResponse>(url, data);
          break;
        case "PATCH":
          response = await httpService.patch<TResponse>(url, data);
          break;
        case "DELETE":
          response = await httpService.delete<TResponse>(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    } catch (error) {
      handleMutationError(error);
      throw error;
    }
  };

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [url] });
      
      // Call custom success handler
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      // Call custom error handler
      if (options.onError) {
        options.onError(error);
      }
    },
  }) as UseMutationResult<TResponse, unknown, TPayload>;
}

// Error handler for mutations (shows toast)
function handleMutationError(error: any) {
  console.error('HTTP Mutation Error:', error);

  let message = 'An error occurred. Please try again.';

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.data?.data?.message) {
    message = error.response.data.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  // Don't show toast for auth errors (they're handled elsewhere)
  if (error?.response?.status !== 401) {
    toast.error(message);
  }
}