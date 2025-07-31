import { format, parseISO } from "date-fns";
import { Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { LeaveRequest } from "@/defination/leave";
import { LeaveRequestCard } from "./LeaveRequestCard";
import { getStatusBadge } from "@/helper/Badge";

interface LeaveRequestsTabProps {
  leaveRequests: LeaveRequest[];
  onApproveRequest: (request: LeaveRequest) => void;
  onRejectRequest: (request: LeaveRequest) => void;
}


 const LeaveRequestsTab = ({
  leaveRequests,
  onApproveRequest,
  onRejectRequest,
}: LeaveRequestsTabProps) => {
  const pendingRequests = leaveRequests.filter((req) => req.status === "pending");
  const processedRequests = leaveRequests.filter((req) => req.status !== "pending");

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
          <CardDescription>Requests awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onApprove={onApproveRequest}
                  onReject={onRejectRequest}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
          <CardDescription>Previously approved or rejected requests</CardDescription>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No processed requests</p>
          ) : (
            <div className="space-y-3">
              {processedRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{request.userName}</p>
                      <p className="text-sm text-gray-600">
                        {request.leaveType?.name} • {request.totalDays} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    <span className="text-sm text-gray-500">
                      {request.approvedDate &&
                        format(parseISO(request.approvedDate), "MMM dd")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestsTab;