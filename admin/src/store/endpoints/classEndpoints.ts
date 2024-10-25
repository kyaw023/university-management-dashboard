import { ClassAllResponse, ClassResponse, Course } from "@/types/classes.types";
import { ApiServices } from "../services/ApiServices";
import { ClassFormValues } from "@/pages/class/ClassForm.page";

const classEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllClasses: build.query<
      ClassAllResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/admin/classes/get-all-classes?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    getSingleClass: build.query<Course, string>({
      query: (id) => ({
        url: `/admin/classes/get-single-class/${id}`,
      }),
    }),

    registerClass: build.mutation<ClassResponse, ClassFormValues>({
      query: (data) => ({
        url: "/admin/classes/class-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    deleteClass: build.mutation<ClassResponse, string>({
      query: (id) => ({
        url: `/admin/classes/delete-class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),

    updateClass: build.mutation<ClassResponse, Course>({
      query: (data) => {
        console.log(data);
        return {
          url: `/admin/classes/update-class/${data._id as string}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["api"],
    }),

    importClass: build.mutation<any, any>({
      query: (data) => ({
        url: `/admin/classes/import-class`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    getClasslist: build.query<Course[], void>({
      query: () => {
        return {
          url: "/admin/classes/get-class-lists",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAllClassesQuery,
  useGetSingleClassQuery,
  useRegisterClassMutation,
  useDeleteClassMutation,
  useUpdateClassMutation,
  useImportClassMutation,
  useGetClasslistQuery,
} = classEndpoints;
