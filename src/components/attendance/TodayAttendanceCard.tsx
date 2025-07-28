"use client";

import React from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AttendanceCardProps = {
  checkInTime: string | null;
  checkOutTime: string | null;
  isCheckedIn: boolean;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
  getTotalHours: (checkIn: string, checkOut: string) => string;
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  checkInTime,
  checkOutTime,
  isCheckedIn,
  handleCheckIn,
  handleCheckOut,
  getTotalHours,
}) => {
  return (
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
            <p className="font-semibold text-blue-700">
              {getTotalHours(checkInTime, checkOutTime)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
