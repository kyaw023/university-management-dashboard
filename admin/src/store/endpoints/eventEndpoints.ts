import { AllEventsResponse, Event, EventResponse } from "@/types/event.types";
import { ApiServices } from "../services/ApiServices";

const eventEndpoints = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query<
      AllEventsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/admin/events/get-all-events?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    getSingleEvent: build.query<Event, string>({
      query: (id) => ({
        url: `/admin/events/getEventById/${id}`,
        method: "GET",
      }),
      providesTags: ["api"],
    }),

    createEvent: build.mutation<any, any>({
      query: (data) => ({
        url: "/admin/events/create-event",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    updateEvent: build.mutation<EventResponse, Event>({
      query: (data) => ({
        url: `/admin/events/update-event/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),

    deleteEvent: build.mutation<EventResponse, string>({
      query: (id) => ({
        url: `/admin/events/delete-event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["api"],
    }),

    importEvents: build.mutation<any, any>({
      query: (data) => ({
        url: `/admin/events/import-events`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["api"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetSingleEventQuery,
  useUpdateEventMutation,
  useImportEventsMutation,
} = eventEndpoints;
