import { apiSlice } from "./apiSlice";
import type { FormValuesUser } from "@/Page/Dashboard/AdminDashboard/UserManagement";
import type {
  GetCurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterUserResponse,
} from "@/defination/authApiResponse";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query<GetCurrentUserResponse, void>({
      query: () => ({
        url: "/api/v1/user/me",
        method: "GET",
      }),
    }),
    registerUser: builder.mutation<RegisterUserResponse, FormValuesUser>({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useRegisterUserMutation,
} = authApiSlice;
