import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "@/app/asyncThunk/user";
import type { UserState } from "@/utils/interfaces/user";

const initialState: UserState = {
  users: [],
    paging : {
    totalCount : 0,
    currentPage : 1,
    pageSize : 10,
    hasNext : false,
    hasPrev : false
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload?.data;
        state.paging = action.payload?.metaData;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Something went wrong";
      });
  },
});

export default userSlice.reducer;
