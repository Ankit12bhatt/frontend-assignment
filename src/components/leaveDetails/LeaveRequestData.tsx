import type { LeaveRequestResponse } from "@/defination/LeaveApiResponse";
import { getStatusBadge } from "@/helper/Badge";
import { format, parseISO } from "date-fns";

type LeaveRequestDataProps = {
  request: LeaveRequestResponse
}
const LeaveRequestData = ( request : LeaveRequestDataProps) => {
  console.log("request", request.request);

  return (
    <div key={request.request.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: request.request.leave_type?.color }} />
          <div>
            <p className="font-medium">{request.request.leave_type?.name}</p>
            <p className="text-sm text-gray-600">
              {format(parseISO(request?.request.start_date), "MMM dd")} - {format(parseISO(request.request?.end_date), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(request?.request?.status)}
          <span className="text-sm text-gray-500">{request?.request?.total_days} days</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Reason</p>
        <p className="text-sm">{request?.request?.reason}</p>
      </div>

      {request.request?.comments && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Admin Response</p>
          <p className="text-sm">{request.request?.comments}</p>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500">
        <span>Applied: {format(parseISO(request.request?.created_at), "MMM dd, yyyy")}</span>
        {request.request?.approved_at && (
          <span>Processed: {format(parseISO(request.request?.approved_at), "MMM dd, yyyy")}</span>
        )}
      </div>
    </div>
  );
};


export default LeaveRequestData;