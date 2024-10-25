import { UserType } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthSlice {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
}

const initialState: AuthSlice = {
  user: null,
  token: null,
  loading: false,
  error: null,
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state: AuthSlice,
      action: PayloadAction<{ user: UserType; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loggedIn = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state: AuthSlice) => {
      state.user = null;
      state.token = null;
      state.loggedIn = false;
      state.error = null; // Clear any error on logout
    },
    setLoading: (state: AuthSlice, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: AuthSlice, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { login, logout, setLoading, setError } = authSlice.actions;

export default authSlice;
