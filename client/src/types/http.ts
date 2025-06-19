export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type onErrorType = { response: { data: { message: string } } };
export type HttpTypes<TResponse> = {
  url: string;
  method?: HttpMethod;
  options?: Omit<
    Partial<{
      onError: (error: onErrorType) => void;
      onSuccess: (data: TResponse) => void;
    }>,
    never
  >;
};