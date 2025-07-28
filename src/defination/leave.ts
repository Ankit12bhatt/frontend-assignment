export interface LeaveType {
  id: string
  name: string
  maxDays: number
  color: string
  isSpecial: boolean // For festivals/events
  description?: string
}

export interface LeaveRequest {
  id: string
  userId: string
  userName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  comments?: string
  adminComments?: string
}

export interface User {
  id: string
  name: string
  role: "employee" | "admin"
  email: string
}
