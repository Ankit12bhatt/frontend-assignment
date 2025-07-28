"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { Check, X, Clock, User, Settings, Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import type { LeaveRequest, LeaveType } from "@/defination/leave"

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[]
  leaveTypes: LeaveType[]
  onApproveRequest: (id: string, adminComments?: string) => void
  onRejectRequest: (id: string, adminComments: string) => void
  onAddLeaveType: (leaveType: Omit<LeaveType, "id">) => void
  onUpdateLeaveType: (id: string, leaveType: Partial<LeaveType>) => void
  onDeleteLeaveType: (id: string) => void
}

export default function LeaveManagement({
  leaveRequests,
  leaveTypes,
  onApproveRequest,
  onRejectRequest,
  onAddLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
}: LeaveManagementProps) {
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null)
  const [adminComments, setAdminComments] = React.useState("")
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false)
  const [approvalAction, setApprovalAction] = React.useState<"approve" | "reject">("approve")

  // Leave type management state
  const [isLeaveTypeDialogOpen, setIsLeaveTypeDialogOpen] = React.useState(false)
  const [editingLeaveType, setEditingLeaveType] = React.useState<LeaveType | null>(null)
  const [leaveTypeName, setLeaveTypeName] = React.useState("")
  const [leaveTypeMaxDays, setLeaveTypeMaxDays] = React.useState("")
  const [leaveTypeColor, setLeaveTypeColor] = React.useState("#3b82f6")
  const [leaveTypeIsSpecial, setLeaveTypeIsSpecial] = React.useState(false)
  const [leaveTypeDescription, setLeaveTypeDescription] = React.useState("")

  const pendingRequests = leaveRequests.filter((req) => req.status === "pending")
  const processedRequests = leaveRequests.filter((req) => req.status !== "pending")

  const handleApproval = (action: "approve" | "reject", request: LeaveRequest) => {
    setSelectedRequest(request)
    setApprovalAction(action)
    setAdminComments("")
    setIsApprovalDialogOpen(true)
  }

  const confirmApproval = () => {
    if (!selectedRequest) return

    if (approvalAction === "approve") {
      onApproveRequest(selectedRequest.id, adminComments)
    } else {
      onRejectRequest(selectedRequest.id, adminComments)
    }

    setIsApprovalDialogOpen(false)
    setSelectedRequest(null)
    setAdminComments("")
  }

  const handleLeaveTypeSubmit = () => {
    if (!leaveTypeName || !leaveTypeMaxDays) return

    const leaveTypeData = {
      name: leaveTypeName,
      maxDays: Number.parseInt(leaveTypeMaxDays),
      color: leaveTypeColor,
      isSpecial: leaveTypeIsSpecial,
      description: leaveTypeDescription,
    }

    if (editingLeaveType) {
      onUpdateLeaveType(editingLeaveType.id, leaveTypeData)
    } else {
      onAddLeaveType(leaveTypeData)
    }

    resetLeaveTypeForm()
  }

  const resetLeaveTypeForm = () => {
    setLeaveTypeName("")
    setLeaveTypeMaxDays("")
    setLeaveTypeColor("#3b82f6")
    setLeaveTypeIsSpecial(false)
    setLeaveTypeDescription("")
    setEditingLeaveType(null)
    setIsLeaveTypeDialogOpen(false)
  }

  const editLeaveType = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType)
    setLeaveTypeName(leaveType.name)
    setLeaveTypeMaxDays(leaveType.maxDays.toString())
    setLeaveTypeColor(leaveType.color)
    setLeaveTypeIsSpecial(leaveType.isSpecial)
    setLeaveTypeDescription(leaveType.description || "")
    setIsLeaveTypeDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="types">Leave Types</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Requests ({pendingRequests.length})
              </CardTitle>
              <CardDescription>Requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-gray-600">{request.leaveType.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: request.leaveType.color }} />
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
                          <p className="font-medium">{format(parseISO(request.startDate), "MMM dd, yyyy")}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date</p>
                          <p className="font-medium">{format(parseISO(request.endDate), "MMM dd, yyyy")}</p>
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

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval("approve", request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleApproval("reject", request)}>
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processed Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Decisions</CardTitle>
              <CardDescription>Previously approved or rejected requests</CardDescription>
            </CardHeader>
            <CardContent>
              {processedRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No processed requests</p>
              ) : (
                <div className="space-y-3">
                  {processedRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{request.userName}</p>
                          <p className="text-sm text-gray-600">
                            {request.leaveType.name} • {request.totalDays} days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <span className="text-sm text-gray-500">
                          {request.approvedDate && format(parseISO(request.approvedDate), "MMM dd")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Leave Types Management
                </CardTitle>
                <CardDescription>Configure available leave types and their settings</CardDescription>
              </div>
              <Dialog open={isLeaveTypeDialogOpen} onOpenChange={setIsLeaveTypeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Leave Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}</DialogTitle>
                    <DialogDescription>Configure the leave type settings</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={leaveTypeName}
                        onChange={(e) => setLeaveTypeName(e.target.value)}
                        placeholder="e.g., Annual Leave"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxDays">Maximum Days</Label>
                      <Input
                        id="maxDays"
                        type="number"
                        value={leaveTypeMaxDays}
                        onChange={(e) => setLeaveTypeMaxDays(e.target.value)}
                        placeholder="e.g., 21"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={leaveTypeColor}
                        onChange={(e) => setLeaveTypeColor(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="special" checked={leaveTypeIsSpecial} onCheckedChange={setLeaveTypeIsSpecial} />
                      <Label htmlFor="special">Special Leave (Festival/Event)</Label>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={leaveTypeDescription}
                        onChange={(e) => setLeaveTypeDescription(e.target.value)}
                        placeholder="Brief description of this leave type"
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={resetLeaveTypeForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleLeaveTypeSubmit}>{editingLeaveType ? "Update" : "Add"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{type.name}</p>
                          {type.isSpecial && (
                            <Badge variant="secondary" className="text-xs">
                              Special
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Max: {type.maxDays} days
                          {type.description && ` • ${type.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editLeaveType(type)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDeleteLeaveType(type.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "Approve" : "Reject"} Leave Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {approvalAction === "approve" ? "Approve" : "Reject"} leave request from{" "}
                  <strong>{selectedRequest.userName}</strong> for <strong>{selectedRequest.totalDays} days</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="admin-comments">
              {approvalAction === "approve" ? "Comments (Optional)" : "Reason for Rejection *"}
            </Label>
            <Textarea
              id="admin-comments"
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              placeholder={
                approvalAction === "approve"
                  ? "Add any comments for the employee..."
                  : "Please provide a reason for rejection..."
              }
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              disabled={approvalAction === "reject" && !adminComments.trim()}
              className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
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
    </div>
  )
}
