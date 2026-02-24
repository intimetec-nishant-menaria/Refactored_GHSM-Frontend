const BASE_URL = "https://localhost:7188/api";

const apiThunk = async <T>(
  endpoint: string,
  body: unknown,
  options?: { withCredentials?: boolean },
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
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

export default apiThunk;
