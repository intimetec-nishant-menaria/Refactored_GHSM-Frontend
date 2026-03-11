import { useSearchParams } from "react-router-dom";

export const useQueryParams = <T extends Record<string, string | null>>() => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries()) as T;
  return params;
};
