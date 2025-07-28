// types/user.ts

export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
}

export interface GetAllUsersResponse {
  status: boolean;
  message: string;
  data: User[];
}

export interface GetUserResponse {
  status: boolean;
  message: string;
  data: User;
}

export interface UpdateUserRequest {
  email: string;
  password: string;
  role: "admin" | "employee";
  employee_id: string;
  department: string;
  position: string;
  phone: string;
  is_Active: boolean;
}

export interface UpdateUserResponse {
  status: boolean;
  message: string;
  data: User;
}

export interface AddUserRequest {
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface AddUserResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

export interface DeleteUserResponse {
  status: boolean;
  message: string;
}
