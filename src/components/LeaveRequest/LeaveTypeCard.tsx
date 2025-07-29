import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LeaveType } from "@/defination/leave";

interface LeaveTypeCardProps {
  leaveType: LeaveType;
  onEdit: (leaveType: LeaveType) => void;
  onDelete: (id: string) => void;
}

 const LeaveTypeCard = ({ leaveType, onEdit, onDelete }: LeaveTypeCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: leaveType.color }}
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{leaveType.name}</p>
            {leaveType.isSpecial && (
              <Badge variant="secondary" className="text-xs">
                Special
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Max: {leaveType.maxDays} days
            {leaveType.description && ` • ${leaveType.description}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(leaveType)}
          title="Edit leave type"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(leaveType.id)}
          title="Delete leave type"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeaveTypeCard;