import type { PagingMetaData } from "./paging";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UserState {
  users: User[];
  paging : PagingMetaData;
  loading: boolean;
  error: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  password: string;
  isActive: boolean;
}
export interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface fetchUsersArgs{
  currentPage:number;
  pageSize:number;
  searchUser:string;
}