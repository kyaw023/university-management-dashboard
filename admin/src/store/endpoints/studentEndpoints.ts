import {
  AllStudentsResponse,
  singleStudentResponse,
  Student,
  StudentRegisterResponse,
} from "@/types/students.types";
import { ApiServices } from "../services/ApiServices";

const studentEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllStudents: build.query<
      AllStudentsResponse,
      { page: number; limit: number; search: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/admin/students/get-all-students?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),

      providesTags: ["api"],
    }),
    getSingleStudent: build.query<singleStudentResponse, string>({
      query: (id) => ({
        url: `/admin/students/get-single-student/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),
    registerStudent: build.mutation<StudentRegisterResponse, Student>({
      query: (data) => ({
        url: "/admin/students/student-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    deleteStudent: build.mutation<StudentRegisterResponse, string>({
      query: (id) => ({
        url: `/admin/students/delete-student/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),
    updateStudent: build.mutation<StudentRegisterResponse, Student>({
      query: (data) => ({
        url: `/admin/students/update-student/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    importStudents: build.mutation<any, FormData>({
      query: (data) => ({
        url: "/admin/students/import-students",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetSingleStudentQuery,
  useRegisterStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
  useImportStudentsMutation,
} = studentEndpoints;
