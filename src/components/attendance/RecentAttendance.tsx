"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"

type AttendanceRecord = {
  date: string
  status: "present" | "partial" | "absent"
  checkIn?: string
  checkOut?: string
  totalHours?: string
}

interface RecentAttendanceProps {
  attendanceHistory: AttendanceRecord[]
}

export default function RecentAttendance({ attendanceHistory }: RecentAttendanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
        <CardDescription>Your attendance records for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attendanceHistory.slice(0, 7).map((record) => (
            <div
              key={record.date}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="text-sm font-medium">
                  {format(parseISO(record.date), "MMM dd, yyyy")}
                </div>

                {record.status === "present" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </Badge>
                )}
                {record.status === "partial" && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Partial
                  </Badge>
                )}
                {record.status === "absent" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    In: <span className="font-mono">{record.checkIn || "--:--"}</span>
                  </span>
                  <span className="text-gray-600">
                    Out: <span className="font-mono">{record.checkOut || "--:--"}</span>
                  </span>
                </div>
                {record.totalHours && (
                  <div className="text-blue-600 font-medium">{record.totalHours}h</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
