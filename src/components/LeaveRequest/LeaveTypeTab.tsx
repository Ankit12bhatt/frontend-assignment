import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { LeaveType } from "@/defination/leave";
import LeaveTypeForm from "./LeaveTypeForm";
import LeaveTypeCard from "./LeaveTypeCard";

interface LeaveTypesTabProps {
  leaveTypes?: LeaveType[];
  onCreateLeaveType: (data: any) => Promise<void>;
  onUpdateLeaveType: (id: number, data: any) => void;
  onDeleteLeaveType: (id: number) => void;
  leaveFetch: () => void; 
}

export const LeaveTypesTab = ({
  leaveTypes,
  onCreateLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
  leaveFetch,
}: LeaveTypesTabProps) => {
  const [isLeaveTypeDialogOpen, setIsLeaveTypeDialogOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);

  const handleEditLeaveType = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setIsLeaveTypeDialogOpen(true);
  };

  const handleAddLeaveType = () => {
    setEditingLeaveType(null);
    setIsLeaveTypeDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsLeaveTypeDialogOpen(false);
    setEditingLeaveType(null);
  };

  const handleFormSubmit = async (data: any) => {
    const mappedData = {
      name: data.name,
      type: data.type,
      max_days: data.max_days,
      color: data.color,
      description: data.description || "no data",
    };

    if (editingLeaveType) {
      onUpdateLeaveType(editingLeaveType.id, mappedData);
    } else {
      await onCreateLeaveType(mappedData);
    }
     leaveFetch();

    handleDialogClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Leave Types Management
          </CardTitle>
          <CardDescription>
            Configure available leave types and their settings
          </CardDescription>
        </div>
        <Dialog open={isLeaveTypeDialogOpen} onOpenChange={setIsLeaveTypeDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddLeaveType}>
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
              </DialogTitle>
              <DialogDescription>
                Configure the leave type settings
              </DialogDescription>
            </DialogHeader>
            <LeaveTypeForm
              editingLeaveType={editingLeaveType}
              onSubmit={handleFormSubmit}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {leaveTypes?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No leave types configured
          </p>
        ) : (
          <div className="space-y-3">
            {leaveTypes?.map((type) => (
              <LeaveTypeCard
                key={type.id}
                leaveType={type}
                onEdit={handleEditLeaveType}
                onDelete={onDeleteLeaveType}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};