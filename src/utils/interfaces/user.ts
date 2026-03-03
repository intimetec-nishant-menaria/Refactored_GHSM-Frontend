export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  isActive: boolean;  
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: number;
  password: string;
  isActive: boolean;
}
export interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
  role: number;
  isActive: boolean;
}
