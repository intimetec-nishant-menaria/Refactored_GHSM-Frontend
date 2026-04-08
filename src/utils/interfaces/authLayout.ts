import type { User } from "@/utils/interfaces/user";
export interface AuthState {
  user: User | null;
  token : string | null ;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export interface AuthLayoutProps {
  title?: string;
  children: React.ReactNode;
  iconSrc?: string;
  iconAlt?: string;
}

export interface LoginResponce{
  message : string;
  user : User;
  token : string;
}
