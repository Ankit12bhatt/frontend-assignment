import { apiSlice } from "./apiSlice";
import type { FormValuesUser } from "@/Page/Dashboard/AdminDashboard/UserManagement";
import type {
  GetAllUsersResponse,
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
    getUser: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: "/api/v1/user",
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
  useGetUserQuery,
  useLazyGetUserQuery,
  useRegisterUserMutation,
} = authApiSlice;
