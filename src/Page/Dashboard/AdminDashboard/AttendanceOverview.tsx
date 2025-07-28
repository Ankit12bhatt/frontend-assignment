"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { Users, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/defination/leave"


interface AttendanceOverviewProps {
  users: User[]
}

interface AttendanceRecord {
  userId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "partial"
  totalHours?: number
}

 const AttendanceOverview = ({ users }: AttendanceOverviewProps) => {
  const [selectedDate, setSelectedDate] = React.useState(format(new Date(), "yyyy-MM-dd"))

  // Mock attendance data - in real app, this would come from API
  const [attendanceRecords] = React.useState<AttendanceRecord[]>([
    {
      userId: "1",
      date: format(new Date(), "yyyy-MM-dd"),
      checkIn: "09:00",
      checkOut: "17:30",
      status: "present",
      totalHours: 8.5,
    },
    {
      userId: "2",
      date: format(new Date(), "yyyy-MM-dd"),
      checkIn: "09:15",
      checkOut: "18:00",
      status: "present",
      totalHours: 8.75,
    },
    {
      userId: "3",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "absent",
    },
    {
      userId: "1",
      date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      checkIn: "08:45",
      checkOut: "17:45",
      status: "present",
      totalHours: 9,
    },
    {
      userId: "2",
      date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      checkIn: "09:30",
      status: "partial",
    },
  ])

  const todaysAttendance = attendanceRecords.filter((record) => record.date === selectedDate)
  const presentToday = todaysAttendance.filter((record) => record.status === "present").length
  const absentToday = todaysAttendance.filter((record) => record.status === "absent").length
  const partialToday = todaysAttendance.filter((record) => record.status === "partial").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Badge>
        )
      case "partial":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Attendance Overview
            </CardTitle>
            <CardDescription>View employee attendance for selected date</CardDescription>
          </div>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={format(new Date(), "yyyy-MM-dd")}>Today ({format(new Date(), "MMM dd")})</SelectItem>
              <SelectItem value={format(subDays(new Date(), 1), "yyyy-MM-dd")}>
                Yesterday ({format(subDays(new Date(), 1), "MMM dd")})
              </SelectItem>
              <SelectItem value={format(subDays(new Date(), 2), "yyyy-MM-dd")}>
                {format(subDays(new Date(), 2), "MMM dd")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{presentToday}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{partialToday}</p>
              <p className="text-sm text-gray-600">Partial</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{absentToday}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
          </div>

          {/* Employee Attendance List */}
          <div className="space-y-3">
            {users.map((user) => {
              const attendance = todaysAttendance.find((record) => record.userId === user.id)
              const status = attendance?.status || "absent"

              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.department} • {user.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      {attendance?.checkIn && (
                        <p className="text-gray-600">
                          In: <span className="font-mono">{attendance.checkIn}</span>
                        </p>
                      )}
                      {attendance?.checkOut && (
                        <p className="text-gray-600">
                          Out: <span className="font-mono">{attendance.checkOut}</span>
                        </p>
                      )}
                      {attendance?.totalHours && <p className="text-blue-600 font-medium">{attendance.totalHours}h</p>}
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default AttendanceOverview