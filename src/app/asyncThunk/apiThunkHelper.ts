const BASE_URL = import.meta.env.BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const fetchApi = async <T>(
  method: HttpMethod,
  endpoint: string,
  body: unknown,
  options?: { withCredentials?: boolean },
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: options?.withCredentials ? "include" : "same-origin",
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

export default fetchApi;
