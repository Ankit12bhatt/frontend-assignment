import type {
  CreateLeaveTypeRequest,
  CreateLeaveTypeResponse,
  DeleteLeaveResponse,
  LeaveTypesResponse,
  LeaveRequest,
  LeaveRequestResponseType
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
    submitleaveRequest: builder.mutation<any, LeaveRequest>({
      query: (data) => ({
        url: "/api/v1/leave/request",
        method: "POST",
        body: data,
      }),
    }),
    getAppliedLeaves: builder.query<LeaveRequestResponseType, void>({
      query: () => ({
        url: "/api/v1/leave/myLeave",
        method: "GET",
      }),
    })
  }),
});

export const {
  useCreateLeaveTypeMutation,
  useGetLeavesQuery,
  useDeleteLeaveTypeMutation,
  useSubmitleaveRequestMutation,
  useGetAppliedLeavesQuery
} = authApiSlice;
