const BASE_URL = "https://localhost:7188/api";

type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface RequestOptions{
  method?: HttpMethods,
  body?: unknown,
  headers?: HeadersInit
}

const apiThunk = async <T>(endpoint: string, options : RequestOptions = {}): Promise<T> => {
  const {method = "GET" , body , headers ={}} = options;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

export default apiThunk;
