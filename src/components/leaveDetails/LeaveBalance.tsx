import { Card, CardContent } from "@/components/ui/card";

type LeaveBalanceCardProps = {
  name: string;
  color: string;
  usedDays: number;
  maxDays: number;
};

 const LeaveBalance = ({ name, color, usedDays, maxDays }: LeaveBalanceCardProps) => {
  const percentage = Math.min((usedDays / maxDays) * 100, 100);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-gray-600">
              {usedDays}/{maxDays} days used
            </p>
          </div>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full transition-all" style={{ backgroundColor: color, width: `${percentage}%` }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalance;
