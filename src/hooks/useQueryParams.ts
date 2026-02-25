import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const email: string | null = searchParams.get("email");
  return { token, email };
};
