import type {
  AddUserRequest,
  AddUserResponse,
  DeleteUserResponse,
  GetAllUsersResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/defination/userApiResponse";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: "/api/v1/user",
        method: "GET",
      }),
    }),

    getUserById: builder.query<GetUserResponse, number>({
      query: (id) => ({
        url: `/api/v1/user/${id}`,
        method: "GET",
      }),
    }),

    addUser: builder.mutation<AddUserResponse, AddUserRequest>({
      query: (data) => ({
        url: "/api/v1/user",
        method: "POST",
        body: data,
      }),
    }),

    updateUser: builder.mutation<
      UpdateUserResponse,
      { id: number; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/user/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (id) => ({
        url: `/api/v1/user/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
