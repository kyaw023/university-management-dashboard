import {
  TeacherRegisterResponse,
  TeacherResponse,
  TeacherType,
} from "@/types/teachers.type";
import { ApiServices } from "../services/ApiServices";

const teacherEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getTeacher: build.query<any, string>({
      query: (id) => ({
        url: `/admin/teachers/get-single-teacher/${id}`,
      }),
    }),
    getSingleTeacher: build.query<TeacherType, string>({
      query: (id) => ({
        url: `/admin/teachers/get-single-teacher/${id}`,
        method: "GET",
      }),
    }),
    registerTeacher: build.mutation<TeacherRegisterResponse, TeacherType>({
      query: (data) => ({
        url: "/admin/teachers/teacher-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    deleteTeacher: build.mutation<TeacherRegisterResponse, string>({
      query: (id) => ({
        url: `/admin/teachers/delete-teacher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),
    updateTeacher: build.mutation<TeacherRegisterResponse, TeacherType>({
      query: (data) => ({
        url: `/admin/teachers/update-teacher/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    importTeacher: build.mutation<any, any>({
      query: (data) => ({
        url: "/admin/teachers/import-teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    getAllTeachers: build.query<
      TeacherResponse,
      { page: number; limit: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url:
          "/admin/teachers/get-all-teachers?page=" + page + "&limit=" + limit,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    getTeacherLists: build.query<TeacherType[], void>({
      query: () => ({
        url: "/admin/teachers/get-teacher-lists",
        method: "GET",
      }),
      providesTags: ["api"],
    }),
  }),
});

export const {
  useGetAllTeachersQuery,
  useGetTeacherQuery,
  useRegisterTeacherMutation,
  useGetSingleTeacherQuery,
  useDeleteTeacherMutation,
  useUpdateTeacherMutation,
  useImportTeacherMutation,
  useGetTeacherListsQuery,
} = teacherEndpoints;
