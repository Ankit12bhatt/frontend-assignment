
export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
export interface User {
    id: number;
    email: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    role: Role;
    loan_disk_user: {
      branch_id: number;
      created_at: string;
      id: number
      role_id: number
      status: boolean;
      updated_at: string;
      user_name: string;
    }
  }

export interface AuthState {
    loading: boolean;
    user: User | null;
}

export interface LoginPayLoad {
    email: string;
    password: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
}
