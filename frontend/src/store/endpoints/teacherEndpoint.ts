import { ApiServices } from "../service/ApiServices";

const teacherEndPoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getTeacherClasses: build.query({
      query: (id) => ({
        url: `/teacher/classes/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),
  }),
});

export const { useGetTeacherClassesQuery } = teacherEndPoints;
