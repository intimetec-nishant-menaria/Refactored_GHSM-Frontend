const BASE_URL = "https://localhost:7188/api";

const apiThunk = async <T>(endpoint: string, body: unknown): Promise<T> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
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
