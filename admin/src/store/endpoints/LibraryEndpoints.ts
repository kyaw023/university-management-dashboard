import { Library, LibraryResponse } from "@/types/library.types";
import { ApiServices } from "../services/ApiServices";

const libraryEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllLibrary: build.query<
      LibraryResponse,
      { page: number; limit: number; search: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/admin/library/get-all-library?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),
    getLibraryDetail: build.query<Library, string>({
      query: (id) => ({
        url: `/admin/library/get-single-library/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    createLibrary: build.mutation({
      query: (data) => ({
        url: `/admin/library/library-register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    DeleteLibrary: build.mutation({
      query: (id) => ({
        url: `/admin/library/delete-library/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),

    UpdateLibrary: build.mutation({
      query: (data) => ({
        url: `/admin/library/update-library/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    importLibrary: build.mutation<any, any>({
      query: (data) => ({
        url: `/admin/library/import-library`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
  }),
});

export const {
  useGetAllLibraryQuery,
  useImportLibraryMutation,
  useDeleteLibraryMutation,
  useUpdateLibraryMutation,
  useGetLibraryDetailQuery,
  useCreateLibraryMutation,
} = libraryEndpoints;
