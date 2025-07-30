"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Users,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatsCard from "@/components/overviewCards";
import AttendanceOverview from "./AttendanceOverview";
import type { User, LeaveRequest, LeaveType } from "@/defination/leave";
import LeaveManagement from "./LeaveManagement";
import UserManagement from "./UserManagement";
import EmployeeDashboard from "../EmployeeDashboard";
import { useGetAllUsersQuery } from "@/store/api/userSlice";
import { useDeleteLeaveTypeMutation, useGetLeavesQuery } from "@/store/api/leaveSlice";
import { toast } from "sonner";

const AdminDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { data: users = [], refetch } = useGetAllUsersQuery();
  const { data: LeaveTypesData, refetch: leaveTypesRefetch } = useGetLeavesQuery();
  const [ deleteLeaveTypeData] = useDeleteLeaveTypeMutation();
  console.log("LeaveTypesData", LeaveTypesData);
    const [leaveTypes, setLeaveTypes] = React.useState<LeaveType[]>();  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>([
    {
      id: "1",
      userId: "1",
      userName: "John Doe",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      totalDays: 6,
      reason: "Family vacation",
      status: "pending",
      appliedDate: "2024-01-20",
      comments: "Planning a trip with family",
    },
    {
      id: "2",
      userId: "2",
      userName: "Jane Smith",
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
      userId: "3",
      userName: "Mike Johnson",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      totalDays: 3,
      reason: "Diwali celebration with family",
      status: "approved",
      appliedDate: "2024-02-15",
      approvedBy: currentUser.id,
      approvedDate: "2024-02-16",
      adminComments: "Approved for festival celebration",
    },
  ]);

  React.useEffect(() => {
    const data = convertToLeaveType(LeaveTypesData?.data || []);
  setLeaveTypes(data);
    console.log("data", data);
    if (data.length === 0) return;

  const updatedRequests = leaveRequests.map((request) => {
    const randomLeaveType = data[Math.floor(Math.random() * data.length)];
    return {
      ...request,
      leaveType: randomLeaveType,
    };
  });

  setLeaveRequests(updatedRequests);
  }, [LeaveTypesData]);





  const convertToLeaveType = (data: any) => {
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      maxDays: item.max_days,
      color: item.color,
      isSpecial: item.type == "special" ? true : false,
      description: item.description || "No description available",
    }));
  };

  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  );
  const userArray: User[] = Array.isArray((users as any).data)
    ? (users as any).data
    : Array.isArray(users)
    ? (users as User[])
    : [];
  const activeUsers = userArray.filter((user: User) => user.is_active);
  const totalLeaveRequests = leaveRequests.length;
  const approvedRequests = leaveRequests.filter(
    (req) => req.status === "approved"
  ).length;

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
          : req
      )
    );
  };

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
          : req
      )
    );
  };

  const handleUpdateLeaveType = (id: number, updates: Partial<LeaveType>) => {
    setLeaveTypes((prev) =>
      prev?.map((type) => (type.id === id ? { ...type, ...updates } : type))
    );
  };

  const handleDeleteLeaveType = async (id: number) => {
    try {
      const response = await deleteLeaveTypeData(id).unwrap();
      if (!response.success) {
        throw new Error(response.message || "Failed to delete leave type");
      }
      toast.success("Leave type deleted successfully");
      setLeaveTypes((prev) => prev?.filter((type) => type.id !== id));
      leaveTypesRefetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting leave type");
    }
  };

  const handleLogut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-8xl mx-auto space-y-6 m-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users, attendance, and leave requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar onClick={() => handleLogut()}>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={
              Array.isArray((users as any).data)
                ? (users as any).data.length
                : Array.isArray(users)
                ? users.length
                : 0
            }
            icon={Users}
            iconColor="text-blue-600"
            subtitle={`${activeUsers.length} active users`}
          />
          <StatsCard
            title="Pending Requests"
            value={pendingRequests.length}
            icon={Clock}
            iconColor="text-yellow-600"
            subtitle="Awaiting approval"
          />
          <StatsCard
            title="Leave Requests"
            value={totalLeaveRequests}
            icon={Calendar}
            iconColor="text-green-600"
            subtitle={`${approvedRequests} approved`}
          />
          <StatsCard
            title="Leave Types"
            value={leaveTypes?.length || 0}
            icon={Settings}
            iconColor="text-purple-600"
            subtitle={`${
              leaveTypes?.filter((t) => t.isSpecial).length
            } special types`}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-25 md:grid-cols-5 md:mb-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="leaves">Leave Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="records"> Personal Record </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Leave Requests
                </CardTitle>
                <CardDescription>
                  Latest leave requests requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {request.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {request.userName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {request.leaveType?.name} • {request.totalDays} days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {request.status === "approved" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                        {request.status === "rejected" && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(
                      new Set(userArray.map((u: User) => u.department))
                    ).map((dept) => {
                      const count = userArray.filter(
                        (u: User) => u.department === dept
                      ).length;
                      const percentage = userArray.length
                        ? (count / userArray.length) * 100
                        : 0;
                      return (
                        <div
                          key={dept}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{dept}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leave Types Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaveTypes?.map((type) => {
                      const usage = leaveRequests.filter(
                        (req) =>
                          req.leaveType?.id === type.id &&
                          req.status === "approved"
                      ).length;
                      return (
                        <div
                          key={type.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: type.color }}
                            />
                            <span className="text-sm font-medium">
                              {type.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {usage} requests
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement
              users={
                users &&
                typeof users === "object" &&
                "data" in users &&
                Array.isArray((users as any).data)
                  ? ((users as any).data as User[])
                  : Array.isArray(users)
                  ? (users as User[])
                  : []
              }
              fetch={refetch}
            />
          </TabsContent>

          <TabsContent value="leaves">
            <LeaveManagement
              leaveRequests={leaveRequests}
              leaveTypes={leaveTypes}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onUpdateLeaveType={handleUpdateLeaveType}
              onDeleteLeaveType={handleDeleteLeaveType}
              leaveFetch = {leaveTypesRefetch}
            />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceOverview
              users={
                users &&
                typeof users === "object" &&
                "data" in users &&
                Array.isArray((users as any).data)
                  ? ((users as any).data as User[])
                  : Array.isArray(users)
                  ? (users as User[])
                  : []
              }
            />
          </TabsContent>

          <TabsContent value="records">
            <EmployeeDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
