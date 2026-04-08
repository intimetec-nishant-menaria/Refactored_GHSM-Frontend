// src/app/api/baseQuery.ts
import { fetchBaseQuery, type BaseQueryFn, type FetchArgs,type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setCredentials, logOut } from '@/app/slices/auth';
import type { User } from '@/utils/interfaces/user';

interface LocalAuthState {
  auth: {
    token: string | null;
    user: any;
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as LocalAuthState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({ 
        url: '/auth/refresh', 
        method: 'POST' 
      }, api, extraOptions);

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken: string ; user : User};
      api.dispatch(setCredentials(data));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export default baseQueryWithReauth;