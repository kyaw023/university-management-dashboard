import { LoginResponse, UserType } from "../../types/user.types";
import { ApiServices } from "../service/ApiServices";

const authEndPoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (data) => ({
        url: "/auth/teacher-login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    checkSeesion: build.query<UserType, void>({
      query: () => ({
        url: "/auth/check-session",
        method: "GET",
      }),
      providesTags: ["api"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["api"],
    }),
  }),
});

export const { useLoginMutation, useCheckSeesionQuery, useLogoutMutation } =
  authEndPoints;
