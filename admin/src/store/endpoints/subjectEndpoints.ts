import {
  singleSubjectResponse,
  SubjectResponse,
  SubjectType,
} from "@/types/subjects.types";
import { ApiServices } from "../services/ApiServices";

const subjectEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllSubjects: build.query<
      SubjectResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/admin/subjects/get-all-subjects?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),
    createSubject: build.mutation<
      {
        message: string;
        subject: SubjectType;
      },
      SubjectType
    >({
      query: (data) => ({
        url: "/admin/subjects/subject-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    updateSubject: build.mutation<
      {
        message: string;
        subject: SubjectType;
      },
      SubjectType
    >({
      query: (data) => ({
        url: `/admin/subjects/update-subject/${data._id as string}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
    deleteSubject: build.mutation<
      {
        message: string;
        subject: SubjectType;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/subjects/delete-subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),
    getSingleSubject: build.query<singleSubjectResponse, string>({
      query: (id) => ({
        url: `/admin/subjects/get-single-subject/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    importSubject: build.mutation<any, any>({
      query: (data) => ({
        url: `/admin/subjects/import-subject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    getSubjectLists: build.query<SubjectType[], void>({
      query: () => ({
        url: `/admin/subjects/get-subject-lists`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),
  }),
});

export const {
  useGetAllSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSingleSubjectQuery,
  useImportSubjectMutation,
  useGetSubjectListsQuery,
} = subjectEndpoints;
