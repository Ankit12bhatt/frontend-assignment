import { getStatusBadge } from "@/helper/Badge";
import { format, parseISO } from "date-fns";

type LeaveRequestItemProps = {
  request: {
    id: string;
    leaveType: { name: string; color: string };
    startDate: string;
    endDate: string;
    totalDays: number;
    status: string;
    reason: string;
    appliedDate: string;
    approvedDate?: string;
    adminComments?: string;
  };
};

const LeaveRequestData = ({ request }: LeaveRequestItemProps) => {

  return (
    <div key={request.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: request.leaveType.color }} />
          <div>
            <p className="font-medium">{request.leaveType.name}</p>
            <p className="text-sm text-gray-600">
              {format(parseISO(request.startDate), "MMM dd")} - {format(parseISO(request.endDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(request.status)}
          <span className="text-sm text-gray-500">{request.totalDays} days</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Reason</p>
        <p className="text-sm">{request.reason}</p>
      </div>

      {request.adminComments && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Admin Response</p>
          <p className="text-sm">{request.adminComments}</p>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500">
        <span>Applied: {format(parseISO(request.appliedDate), "MMM dd, yyyy")}</span>
        {request.approvedDate && (
          <span>Processed: {format(parseISO(request.approvedDate), "MMM dd, yyyy")}</span>
        )}
      </div>
    </div>
  );
};


export default LeaveRequestData;