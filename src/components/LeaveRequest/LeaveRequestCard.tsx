import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { User, Check, X } from "lucide-react";
import type { LeaveRequest } from "@/defination/leave";
import { getStatusBadge } from "@/helper/Badge";



interface LeaveRequestCardProps {
  request: LeaveRequest;
  onApprove: (request: LeaveRequest) => void;
  onReject: (request: LeaveRequest) => void;
  showActions?: boolean;
}

export const LeaveRequestCard = ({
  request,
  onApprove,
  onReject,
  showActions = true,
}: LeaveRequestCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">{request.userName}</p>
            <p className="text-sm text-gray-600">
              {request.leaveType?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: request.leaveType?.color }}
          />
          {getStatusBadge(request.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-600">Duration</p>
          <p className="font-medium">{request.totalDays} days</p>
        </div>
        <div>
          <p className="text-gray-600">Start Date</p>
          <p className="font-medium">
            {format(parseISO(request.startDate), "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-gray-600">End Date</p>
          <p className="font-medium">
            {format(parseISO(request.endDate), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div>
        <p className="text-gray-600 text-sm mb-1">Reason</p>
        <p className="text-sm">{request.reason}</p>
      </div>

      {request.comments && (
        <div>
          <p className="text-gray-600 text-sm mb-1">Additional Comments</p>
          <p className="text-sm">{request.comments}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onApprove(request)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject(request)}
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};
