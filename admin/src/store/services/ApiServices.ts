import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiServices = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["api"],
  endpoints: () => ({}),
});
