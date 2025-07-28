import {
  CheckCircle,
  Timer,
  AlertCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceStatsProps {
  attendanceStats: {
    presentDays: number
    totalWorkingDays: number
    totalHours: number
    averageHours: number
    lateCheckIns: number
    absentDays: number
    partialDays: number
  }
}

const AttendanceStatistics = ( {attendanceStats}: AttendanceStatsProps) => {
  const attendanceRate =
    (attendanceStats.presentDays / attendanceStats.totalWorkingDays) * 100
  const punctuality =
    ((attendanceStats.presentDays - attendanceStats.lateCheckIns) /
      attendanceStats.presentDays) *
    100

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Days</p>
                <p className="text-2xl font-bold text-green-600">
                  {attendanceStats.presentDays}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {attendanceRate.toFixed(1)}% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {attendanceStats.totalHours.toFixed(1)}
                </p>
              </div>
              <Timer className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Avg: {attendanceStats.averageHours.toFixed(1)}h per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Check-ins</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {attendanceStats.lateCheckIns}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">After 9:00 AM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Absent Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-red-600 mb-2">
                {attendanceStats.absentDays}
              </div>
              <div className="text-gray-600">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Working Days</span>
                <span className="text-sm text-gray-600">
                  {attendanceStats.totalWorkingDays}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Present</span>
                <span className="text-sm text-gray-600">
                  {attendanceStats.presentDays} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-600">Partial</span>
                <span className="text-sm text-gray-600">
                  {attendanceStats.partialDays} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">Absent</span>
                <span className="text-sm text-gray-600">
                  {attendanceStats.absentDays} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {attendanceRate.toFixed(1)}%
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Punctuality</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {punctuality.toFixed(1)}%
                  </span>
                  {attendanceStats.lateCheckIns > 2 ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Daily Hours</span>
                <span className="text-sm text-gray-600">
                  {attendanceStats.averageHours.toFixed(1)}h
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AttendanceStatistics
