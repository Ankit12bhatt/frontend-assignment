export interface RegisterUserResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  employee_id: string;
  department: string;
  position: string;
  created_at: string;
}

export interface GetAllUsersResponse {
  status: boolean;
  message: string;
  data: UserData[];
}


export interface GetCurrentUserResponse {
  status: boolean;
  message: string;
  data: UserData;
}
export interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}