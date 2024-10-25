import { LoginResponse, UserType } from "@/types/types";
import { ApiServices } from "../services/ApiServices";

const authEndPoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (data) => ({
        url: "/admin/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    checkSeesion: build.query<UserType, void>({
      query: () => ({
        url: "/admin/auth/check-session",
        method: "GET",
      }),
      providesTags: ["api"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["api"],
    }),
    me: build.query<UserType, void>({
      query: () => ({
        url: "/admin/auth/me",
        method: "GET",
      }),
      providesTags: ["api"],
    }),
    updateProfile: build.mutation<
      { message: string; user: UserType },
      UserType
    >({
      query: (data) => {
        console.log(data);
        return {
          url: `/admin/auth/update-profile/${data._id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["api"],
    }),
  }),
});

export const {
  useLoginMutation,
  useCheckSeesionQuery,
  useLogoutMutation,
  useMeQuery,
  useUpdateProfileMutation,
} = authEndPoints;
