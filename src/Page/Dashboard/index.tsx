"use client"

import * as React from "react"
import { format, subDays, parseISO } from "date-fns"
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Users, CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User as UserType } from "@/defination/leave"
import LeaveDashboard from "./LeaveDashboard"

interface AttendanceRecord {
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "partial"
}

export default function AttendanceDashboard() {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = React.useState(false)
  const [checkInTime, setCheckInTime] = React.useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState("")
  const [selectedTime, setSelectedTime] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<"in" | "out">("in")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Mock current user - in real app, this would come from auth context
  const [currentUser] = React.useState<UserType>({
    id: "user1",
    name: "John Doe",
    role: "employee", // Change to "admin" to see admin interface
    email: "john.doe@company.com",
  })

  // Mock attendance data for previous days
  const [attendanceHistory, setAttendanceHistory] = React.useState<AttendanceRecord[]>([
    {
      date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      checkIn: "09:15",
      checkOut: "17:30",
      status: "present",
    },
    {
      date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
      checkIn: "09:00",
      status: "partial",
    },
    {
      date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
      status: "absent",
    },
    {
      date: format(subDays(new Date(), 4), "yyyy-MM-dd"),
      checkIn: "08:45",
      checkOut: "18:00",
      status: "present",
    },
  ])

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = () => {
    const now = format(new Date(), "HH:mm")
    setCheckInTime(now)
    setIsCheckedIn(true)
  }

  const handleCheckOut = () => {
    const now = format(new Date(), "HH:mm")
    setCheckOutTime(now)
    setIsCheckedIn(false)
  }

  const handleMissedAttendance = () => {
    if (!selectedDate || !selectedTime) return

    const updatedHistory = attendanceHistory.map((record) => {
      if (record.date === selectedDate) {
        const updated = { ...record }
        if (selectedType === "in") {
          updated.checkIn = selectedTime
        } else {
          updated.checkOut = selectedTime
        }

        // Update status based on check-in/out presence
        if (updated.checkIn && updated.checkOut) {
          updated.status = "present"
        } else if (updated.checkIn || updated.checkOut) {
          updated.status = "partial"
        }

        return updated
      }
      return record
    })

    setAttendanceHistory(updatedHistory)
    setIsDialogOpen(false)
    setSelectedDate("")
    setSelectedTime("")
    setSelectedType("in")
  }

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

  const getTotalHours = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return null

    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)

    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin

    const totalMinutes = outMinutes - inMinutes
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {currentUser.role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
            </h1>
            <p className="text-gray-600 mt-1">{format(currentTime, "EEEE, MMMM do, yyyy")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-600 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance" className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4 text-white" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2 text-white">
              <CalendarDays className="w-4 h-4 text-white" />
              Leave Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6 mt-4">
            {/* Current Time and Today's Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Time Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 ">
                    <Clock className="w-5 h-5" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-mono font-bold text-blue-600 mb-2">
                      {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-gray-600">{format(currentTime, "EEEE, MMMM do")}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Attendance
                  </CardTitle>
                  <CardDescription>Log your check-in and check-out times</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Check In</p>
                      <p className="font-mono font-semibold text-green-700">{checkInTime || "--:--"}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Check Out</p>
                      <p className="font-mono font-semibold text-red-700">{checkOutTime || "--:--"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCheckedIn ? (
                      <Button onClick={handleCheckIn} className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    ) : (
                      <Button onClick={handleCheckOut} variant="destructive" className="flex-1">
                        <XCircle className="w-4 h-4 mr-2" />
                        Check Out
                      </Button>
                    )}
                  </div>

                  {checkInTime && checkOutTime && (
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Hours</p>
                      <p className="font-semibold text-blue-700">{getTotalHours(checkInTime, checkOutTime)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Attendance History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>Your recent attendance records</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Log Missed Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Log Missed Attendance</DialogTitle>
                      <DialogDescription>Add missing check-in or check-out time for previous days</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date">Select Date</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a date" />
                          </SelectTrigger>
                          <SelectContent>
                            {attendanceHistory.map((record) => (
                              <SelectItem key={record.date} value={record.date}>
                                {format(parseISO(record.date), "MMM dd, yyyy")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={selectedType} onValueChange={(value: "in" | "out") => setSelectedType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">Check In</SelectItem>
                            <SelectItem value="out">Check Out</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleMissedAttendance}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div
                      key={record.date}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className="text-sm font-medium">{format(parseISO(record.date), "MMM dd, yyyy")}</div>
                        {getStatusBadge(record.status)}
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
                        {record.checkIn && record.checkOut && (
                          <div className="text-blue-600 font-medium">
                            {getTotalHours(record.checkIn, record.checkOut)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <LeaveDashboard currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
