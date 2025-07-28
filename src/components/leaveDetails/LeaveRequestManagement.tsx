import LeaveRequestForm from "@/Page/Dashboard/LeveRequest";
import { LeaveRequestList } from "./LeaveRequestList";
import LeaveBalanceOverview from "./LeaveBalanceOverview";

type LeaveManagementSectionProps = {
  leaveTypes: any[];
  leaveRequests: any[];
  handleSubmitRequest: (data: any) => void;
};

export const LeaveManagementSection = ({ leaveTypes, leaveRequests, handleSubmitRequest }: LeaveManagementSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Request and track your leave applications</p>
        </div>
        <LeaveRequestForm leaveTypes={leaveTypes} onSubmitRequest={handleSubmitRequest} />
      </div>

      <LeaveBalanceOverview leaveTypes={leaveTypes} leaveRequests={leaveRequests} />

      <LeaveRequestList leaveRequests={leaveRequests} />
    </div>
  );
};
