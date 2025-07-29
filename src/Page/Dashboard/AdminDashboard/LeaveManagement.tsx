"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCreateLeaveTypeMutation } from "@/store/api/leaveSlice";
import type { LeaveRequest, LeaveType } from "@/defination/leave";
import LeaveRequestsTab from "@/components/LeaveRequest/LeaveRequestTab";
import { LeaveTypesTab } from "@/components/LeaveRequest/LeaveTypeTab";
import ApprovalDialog from "@/components/LeaveRequest/ApprovalDialog";

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
  leaveTypes: LeaveType[];
  onApproveRequest: (id: string, adminComments?: string) => void;
  onRejectRequest: (id: string, adminComments: string) => void;
  onUpdateLeaveType: (id: string, leaveType: Partial<LeaveType>) => void;
  onDeleteLeaveType: (id: string) => void;
}

const LeaveManagement = ({
  leaveRequests,
  leaveTypes,
  onApproveRequest,
  onRejectRequest,
  onUpdateLeaveType,
  onDeleteLeaveType,
}: LeaveManagementProps) => {
  // Approval dialog state
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [adminComments, setAdminComments] = useState("");
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");

  // API mutation
  const [createLeaveType] = useCreateLeaveTypeMutation();

  const handleApprovalAction = (action: "approve" | "reject", request: LeaveRequest) => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setAdminComments("");
    setIsApprovalDialogOpen(true);
  };

  const confirmApproval = () => {
    if (!selectedRequest) return;

    if (approvalAction === "approve") {
      onApproveRequest(selectedRequest.id, adminComments);
    } else {
      onRejectRequest(selectedRequest.id, adminComments);
    }

    setIsApprovalDialogOpen(false);
    setSelectedRequest(null);
    setAdminComments("");
  };

  const handleCreateLeaveType = async (data: any) => {
    try {
      const response = await createLeaveType(data).unwrap();
      if (!response.success) {
        throw new Error(response.message || "Failed to create leave type");
      }
      toast.success(response.message || "Leave type created successfully");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while processing your request");
      throw error;
    }
  };

  const closeApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setSelectedRequest(null);
    setAdminComments("");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="types">Leave Types</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <LeaveRequestsTab
            leaveRequests={leaveRequests}
            onApproveRequest={(request) => handleApprovalAction("approve", request)}
            onRejectRequest={(request) => handleApprovalAction("reject", request)}
          />
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <LeaveTypesTab
            leaveTypes={leaveTypes}
            onCreateLeaveType={handleCreateLeaveType}
            onUpdateLeaveType={onUpdateLeaveType}
            onDeleteLeaveType={onDeleteLeaveType}
          />
        </TabsContent>
      </Tabs>

      <ApprovalDialog
        isOpen={isApprovalDialogOpen}
        onClose={closeApprovalDialog}
        selectedRequest={selectedRequest}
        approvalAction={approvalAction}
        adminComments={adminComments}
        onCommentsChange={setAdminComments}
        onConfirm={confirmApproval}
      />
    </div>
  );
};

export default LeaveManagement;