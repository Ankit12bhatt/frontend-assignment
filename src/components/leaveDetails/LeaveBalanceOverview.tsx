import LeaveBalance from "./LeaveBalance";


type LeaveType = {
  id: string;
  name: string;
  color: string;
  maxDays: number;
};

type LeaveRequest = {
  leaveType?: LeaveType;
  status: string;
  totalDays: number;
};

type LeaveBalanceOverviewProps = {
  leaveTypes?: LeaveType[];
  leaveRequests?: LeaveRequest[];
};

const LeaveBalanceOverview = ({ leaveTypes, leaveRequests }: LeaveBalanceOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {leaveTypes?.map((type) => {
        const usedDays = leaveRequests?.filter(req => req.leaveType?.id === type.id && req.status === "approved")
          .reduce((sum, req) => sum + req.totalDays, 0);

        return (
          <LeaveBalance
            key={type.id}
            name={type.name}
            color={type.color}
            usedDays={usedDays}
            maxDays={type.maxDays}
          />
        );
      })}
    </div>
  );
};
export default LeaveBalanceOverview;