import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import {
  Clock,
  UserIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AttendanceStats,
  LeaveType,
} from "@/defination/leave";
import { AttendanceCard } from "@/components/attendance/TodayAttendanceCard";
import RecentAttendance from "@/components/attendance/RecentAttendance";
import { LeaveManagementSection } from "@/components/leaveDetails/LeaveRequestManagement";
import AttendanceStatistics from "@/components/stats/attendanceStats";
import { useEffect, useMemo, useState } from "react";
import { useGetAppliedLeavesQuery, useGetLeavesQuery } from "@/store/api/leaveSlice";
import { convertToLeaveType } from "@/helper/convertLeave";
import type { LeaveRequestResponse } from "@/defination/LeaveApiResponse";

interface AttendanceRecord {
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "partial";
  totalHours?: string;
}

 const EmployeeDashboard =() => {
   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestResponse[]>();
  const {data: leaveTypesData} = useGetLeavesQuery();
  const {data: appliedLeave, refetch: appliedLeaveRefetch } = useGetAppliedLeavesQuery();
  useEffect(()=> {
    setLeaveRequests(appliedLeave?.data || []);
  },[appliedLeave])
  useEffect(() => {
    const data = convertToLeaveType(leaveTypesData?.data || []);
    setLeaveTypes(data);
  }, [leaveTypesData]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>();


  const [attendanceHistory] = useState<
    AttendanceRecord[]
  >([
    {
      date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      checkIn: "09:15",
      checkOut: "17:30",
      status: "present",
      totalHours: "8.25",
    },
    {
      date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
      checkIn: "09:00",
      checkOut: "18:00",
      status: "present",
      totalHours: "9",
    },
    {
      date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
      checkIn: "09:30",
      status: "partial",
    },
    {
      date: format(subDays(new Date(), 4), "yyyy-MM-dd"),
      status: "absent",
    },
    {
      date: format(subDays(new Date(), 5), "yyyy-MM-dd"),
      checkIn: "08:45",
      checkOut: "17:45",
      status: "present",
      totalHours: "9",
    },
  ]);

  // Calculate attendance statistics
  const attendanceStats: AttendanceStats = useMemo(() => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const workingDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    }).filter((day) => day.getDay() !== 0 && day.getDay() !== 6);

    const presentDays = attendanceHistory.filter(
      (record) => record.status === "present"
    ).length;
    const absentDays = attendanceHistory.filter(
      (record) => record.status === "absent"
    ).length;
    const partialDays = attendanceHistory.filter(
      (record) => record.status === "partial"
    ).length;
    const totalHours = attendanceHistory
      .filter((record) => record.totalHours)
      .reduce(
        (sum, record) =>
          sum + (record.totalHours ? parseFloat(record.totalHours) : 0),
        0
      );
    const lateCheckIns = attendanceHistory.filter(
      (record) => record.checkIn && record.checkIn > "09:00"
    ).length;

    return {
      totalWorkingDays: workingDays.length,
      presentDays,
      absentDays,
      partialDays,
      totalHours,
      averageHours: presentDays > 0 ? totalHours / presentDays : 0,
      lateCheckIns,
      earlyCheckOuts: 0,
    };
  }, [attendanceHistory]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = format(new Date(), "HH:mm");
    setCheckInTime(now);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    const now = format(new Date(), "HH:mm");
    setCheckOutTime(now);
    setIsCheckedIn(false);
  };


  const getTotalHours = (checkIn?: string, checkOut?: string): string => {
    if (!checkIn || !checkOut) return "";
    console.log("checkIn", checkIn, "checkOut", checkOut);

    const [inHour, inMin] = checkIn?.split(":").map(Number);
    const [outHour, outMin] = checkOut?.split(":").map(Number);

    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;

    const totalMinutes = outMinutes - inMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-8xl mx-auto space-y-6 m-2">
        {/* Header */}
        {currentUser && currentUser.role !== "admin" && ( 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Employee Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {format(currentTime, "EEEE, MMMM do, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                <UserIcon className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-600">{currentUser.position}</p>
            </div>
          </div>
        </div>
        )}

        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full  grid-cols-2 mb-12 md:grid-cols-3 ">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            {/* Current Time and Today's Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Time Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-mono font-bold text-blue-600 mb-2">
                      {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-gray-600">
                      {format(currentTime, "EEEE, MMMM do")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Attendance */}
              <AttendanceCard
                checkInTime={checkInTime}
                checkOutTime={checkOutTime}
                isCheckedIn={isCheckedIn}
                handleCheckIn={handleCheckIn}
                handleCheckOut={handleCheckOut}
                getTotalHours={getTotalHours}
              />
            </div>

            {/* Recent Attendance */}
            <RecentAttendance attendanceHistory={attendanceHistory} />
          </TabsContent>

          <TabsContent value="leave" className="space-y-6">
            <LeaveManagementSection
              leaveTypes={leaveTypes}
              leaveRequests={leaveRequests}
              appliedLeaveRefetch={appliedLeaveRefetch}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <AttendanceStatistics attendanceStats={attendanceStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EmployeeDashboard;