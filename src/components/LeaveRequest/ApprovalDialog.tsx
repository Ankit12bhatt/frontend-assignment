import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LeaveRequest } from "@/defination/leave";

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: LeaveRequest | null;
  approvalAction: "approve" | "reject";
  adminComments: string;
  onCommentsChange: (comments: string) => void;
  onConfirm: () => void;
}

 const ApprovalDialog = ({
  isOpen,
  onClose,
  selectedRequest,
  approvalAction,
  adminComments,
  onCommentsChange,
  onConfirm,
}: ApprovalDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {approvalAction === "approve" ? "Approve" : "Reject"} Leave Request
          </DialogTitle>
          <DialogDescription>
            {selectedRequest && (
              <>
                {approvalAction === "approve" ? "Approve" : "Reject"} leave
                request from <strong>{selectedRequest.userName}</strong> for{" "}
                <strong>{selectedRequest.totalDays} days</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="admin-comments">
            {approvalAction === "approve"
              ? "Comments (Optional)"
              : "Reason for Rejection *"}
          </Label>
          <Textarea
            id="admin-comments"
            value={adminComments}
            onChange={(e) => onCommentsChange(e.target.value)}
            placeholder={
              approvalAction === "approve"
                ? "Add any comments for the employee..."
                : "Please provide a reason for rejection..."
            }
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={approvalAction === "reject" && !adminComments.trim()}
            className={
              approvalAction === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
            variant={approvalAction === "reject" ? "destructive" : "default"}
          >
            {approvalAction === "approve" ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Approve
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;