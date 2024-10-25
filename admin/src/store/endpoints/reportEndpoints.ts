import { ApiServices } from "../services/ApiServices";

const reportEndpoints = ApiServices.injectEndpoints({
  endpoints: (builder) => ({
    // Reports
    getStudentPerformanceReport: builder.query<any[], void>({
      query: () => ({
        url: "admin/reports/student-performance",
        method: "GET",
      }),
    }),
    getTeacherWorkloadReport: builder.query<any[], void>({
      query: () => ({
        url: "admin/reports/teacher-workload",
        method: "GET",
      }),
    }),
    getClassCapacityReport: builder.query<any[], void>({
      query: () => ({
        url: "admin/reports/class-capacity",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetStudentPerformanceReportQuery,
  useGetTeacherWorkloadReportQuery,
  useGetClassCapacityReportQuery,
} = reportEndpoints;
