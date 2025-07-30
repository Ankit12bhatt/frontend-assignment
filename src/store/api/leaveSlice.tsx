import type {
  CreateLeaveTypeRequest,
  CreateLeaveTypeResponse,
  DeleteLeaveResponse,
  LeaveTypesResponse,
} from "@/defination/LeaveApiResponse";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query<LeaveTypesResponse, void>({
      query: () => ({
        url: "/api/v1/leave",
        method: "GET",
      }),
    }),
    createLeaveType: builder.mutation<
      CreateLeaveTypeResponse,
      CreateLeaveTypeRequest
    >({
      query: (data) => ({
        url: "/api/v1/leave",
        method: "POST",
        body: data,
      }),
    }),
    deleteLeaveType: builder.mutation<DeleteLeaveResponse , number>({
      query: (id) => ({
        url: `/api/v1/leave/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLeaveTypeMutation,
  useGetLeavesQuery,
  useDeleteLeaveTypeMutation
} = authApiSlice;
