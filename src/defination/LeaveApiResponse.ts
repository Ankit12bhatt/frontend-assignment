

export interface LeaveType {
  id: number
  name: string
  type: string  
  max_days: number
  color: string
  description: string
  is_active: boolean
  created_at: string  // ISO timestamp
  updated_at: string
}
export interface LeaveTypesResponse {
  success: boolean
  data: LeaveType[]
}

export interface CreateLeaveTypeRequest {
name: string
  type: string  
  max_days: number
  color: string
  description: string
 
}

export interface CreateLeaveTypeResponse {
  success: boolean
  message: string
  status: boolean
  data: {
    leaveTypeId: number
  }
}


export interface DeleteLeaveResponse {
  success?: boolean
  message: string
  status: boolean
}

export interface LeaveRequest {
  id?: string
  leave_type_id: number;
  start_date: string
  end_date: string
  total_days: number
  reason: string
  status: "pending"
  applied_date: string
  comments?: string
}

export interface LeaveRequestResponse {
  id: number;
  user_id: number;
  leave_type_id: number;
  start_date: string;         
  end_date: string;           
  total_days: number;
  reason: string;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';  
  admin_comments: string | null;
  approved_by: number | null;
  approved_at: string | null; 
  created_at: string;         
  updated_at: string; 
  leave_type: LeaveType;        
}

export interface LeaveRequestResponseType {
  status: boolean;
  message: string;
  data: LeaveRequestResponse[];
}
