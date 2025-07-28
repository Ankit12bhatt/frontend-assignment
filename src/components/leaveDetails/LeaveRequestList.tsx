import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import LeaveRequestData from "./LeaveRequestData";

type LeaveRequestListProps = {
  leaveRequests: any[];
};

export const LeaveRequestList = ({ leaveRequests }: LeaveRequestListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          My Leave Requests
        </CardTitle>
        <CardDescription>
          Track your submitted leave applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No leave requests found
          </p>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <LeaveRequestData key={request.id} request={request} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
