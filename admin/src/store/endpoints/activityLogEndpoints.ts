import { IActivityLogsResponse } from "@/types/activityLog.types";
import { ApiServices } from "../services/ApiServices";

const activityLogEndpoints = ApiServices.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<
      IActivityLogsResponse,
      { page: number; limit: number; search: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/admin/activity-log?page=${page}&limit=${limit}&search=${search}`,
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogEndpoints;
