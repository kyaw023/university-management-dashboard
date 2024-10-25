import {
  DetailExamResponse,
  ExamFormValues,
  ExamInfo,
  ExamsResponse,
  ExamType,
} from "@/types/exam.types";
import { ApiServices } from "./../services/ApiServices";

const examEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllExams: build.query<
      ExamsResponse,
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `/admin/exam-management/get-all-exams?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    getSingleExam: build.query<DetailExamResponse, string>({
      query: (id) => ({
        url: `/admin/exam-management/single-exam/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    createExam: build.mutation<ExamInfo, ExamFormValues>({
      query: (data) => ({
        url: "/admin/exam-management/create-exam",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    updateExam: build.mutation<ExamInfo, ExamType>({
      query: (data) => ({
        url: `/admin/exam-management/update-exam/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    deleteExam: build.mutation<ExamInfo, string>({
      query: (id) => ({
        url: `/admin/exam-management/delete-exam/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),

    importExam: build.mutation<any, any>({
      query: (data) => ({
        url: `/admin/exam-management/import-exam`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useDeleteExamMutation,
  useGetAllExamsQuery,
  useGetSingleExamQuery,
  useUpdateExamMutation,
  useImportExamMutation,
} = examEndpoints;
