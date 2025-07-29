import type {
  CreateLeaveTypeRequest,
  CreateLeaveTypeResponse,
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
  }),
});

export const {
  useCreateLeaveTypeMutation,
  useGetLeavesQuery,
} = authApiSlice;
