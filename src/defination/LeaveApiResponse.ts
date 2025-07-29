

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
