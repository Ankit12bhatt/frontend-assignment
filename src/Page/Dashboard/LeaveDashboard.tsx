"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LeaveRequestForm from "./LeveRequest"
import type { LeaveRequest, LeaveType, User } from "@/defination/leave"
import LeaveManagement from "./LeaveManagement"


interface LeaveDashboardProps {
  currentUser: User
}

export default function LeaveDashboard({ currentUser }: LeaveDashboardProps) {
  // Mock data - in real app, this would come from API
  const [leaveTypes, setLeaveTypes] = React.useState<LeaveType[]>([
    {
      id: "1",
      name: "Annual Leave",
      maxDays: 21,
      color: "#3b82f6",
      isSpecial: false,
      description: "Regular annual vacation days",
    },
    {
      id: "2",
      name: "Sick Leave",
      maxDays: 10,
      color: "#ef4444",
      isSpecial: false,
      description: "Medical leave for illness",
    },
    {
      id: "3",
      name: "Diwali Festival",
      maxDays: 3,
      color: "#f59e0b",
      isSpecial: true,
      description: "Special leave for Diwali celebration",
    },
    {
      id: "4",
      name: "Christmas",
      maxDays: 2,
      color: "#10b981",
      isSpecial: true,
      description: "Christmas holiday leave",
    },
  ])

  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>([
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      leaveType: leaveTypes[0],
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      totalDays: 6,
      reason: "Family vacation",
      status: "approved",
      appliedDate: "2024-01-20",
      approvedBy: "admin1",
      approvedDate: "2024-01-22",
      comments: "Planning a trip with family",
      adminComments: "Approved. Enjoy your vacation!",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      leaveType: leaveTypes[1],
      startDate: "2024-01-28",
      endDate: "2024-01-30",
      totalDays: 3,
      reason: "Flu symptoms",
      status: "pending",
      appliedDate: "2024-01-25",
      comments: "Feeling unwell, need rest",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Mike Johnson",
      leaveType: leaveTypes[2],
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      totalDays: 3,
      reason: "Diwali celebration with family",
      status: "rejected",
      appliedDate: "2024-02-15",
      approvedBy: "admin1",
      approvedDate: "2024-02-16",
      adminComments: "Festival leave quota already exhausted for this period",
    },
  ])

  const userRequests = leaveRequests.filter((req) => req.userId === currentUser.id)

  const handleSubmitRequest = (
    requestData: Omit<LeaveRequest, "id" | "userId" | "userName" | "appliedDate" | "status">,
  ) => {
    const newRequest: LeaveRequest = {
      ...requestData,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      appliedDate: format(new Date(), "yyyy-MM-dd"),
      status: "pending",
    }
    setLeaveRequests((prev) => [newRequest, ...prev])
  }

  const handleApproveRequest = (id: string, adminComments?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "approved" as const,
              approvedBy: currentUser.id,
              approvedDate: format(new Date(), "yyyy-MM-dd"),
              adminComments,
            }
          : req,
      ),
    )
  }

  const handleRejectRequest = (id: string, adminComments: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected" as const,
              approvedBy: currentUser.id,
              approvedDate: format(new Date(), "yyyy-MM-dd"),
              adminComments,
            }
          : req,
      ),
    )
  }

  const handleAddLeaveType = (leaveTypeData: Omit<LeaveType, "id">) => {
    const newLeaveType: LeaveType = {
      ...leaveTypeData,
      id: Date.now().toString(),
    }
    setLeaveTypes((prev) => [...prev, newLeaveType])
  }

  const handleUpdateLeaveType = (id: string, updates: Partial<LeaveType>) => {
    setLeaveTypes((prev) => prev.map((type) => (type.id === id ? { ...type, ...updates } : type)))
  }

  const handleDeleteLeaveType = (id: string) => {
    setLeaveTypes((prev) => prev.filter((type) => type.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  if (currentUser.role === "admin") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
            <p className="text-gray-600">Manage leave requests and configure leave types</p>
          </div>
        </div>

        <LeaveManagement
          leaveRequests={leaveRequests}
          leaveTypes={leaveTypes}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onAddLeaveType={handleAddLeaveType}
          onUpdateLeaveType={handleUpdateLeaveType}
          onDeleteLeaveType={handleDeleteLeaveType}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Request and track your leave applications</p>
        </div>
        <LeaveRequestForm leaveTypes={leaveTypes} onSubmitRequest={handleSubmitRequest} />
      </div>

      {/* Leave Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveTypes.map((type) => {
          const usedDays = userRequests
            .filter((req) => req.leaveType.id === type.id && req.status === "approved")
            .reduce((sum, req) => sum + req.totalDays, 0)

          return (
            <Card key={type.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{type.name}</p>
                    <p className="text-xs text-gray-600">
                      {usedDays}/{type.maxDays} days used
                    </p>
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: type.color,
                      width: `${Math.min((usedDays / type.maxDays) * 100, 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* My Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            My Leave Requests
          </CardTitle>
          <CardDescription>Track your submitted leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          {userRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leave requests found</p>
          ) : (
            <div className="space-y-4">
              {userRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: request.leaveType.color }} />
                      <div>
                        <p className="font-medium">{request.leaveType.name}</p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(request.startDate), "MMM dd")} -{" "}
                          {format(parseISO(request.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <span className="text-sm text-gray-500">{request.totalDays} days</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reason</p>
                    <p className="text-sm">{request.reason}</p>
                  </div>

                  {request.adminComments && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Admin Response</p>
                      <p className="text-sm">{request.adminComments}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Applied: {format(parseISO(request.appliedDate), "MMM dd, yyyy")}</span>
                    {request.approvedDate && (
                      <span>Processed: {format(parseISO(request.approvedDate), "MMM dd, yyyy")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
