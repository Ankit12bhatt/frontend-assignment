export interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
  color: string;
  isSpecial: boolean; // For festivals/events
  description?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType?: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  adminComments?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  department: string;
  position: string;
  joinDate: string;
  is_active: boolean;
  avatar?: string;
  phone?: string;
  employeeId: string;
}

export interface AttendanceStats {
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  partialDays: number;
  totalHours: number;
  averageHours: number;
  lateCheckIns: number;
  earlyCheckOuts: number;
}
