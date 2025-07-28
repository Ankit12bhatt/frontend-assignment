"use client"

import * as React from "react"
import { format, differenceInDays, parseISO } from "date-fns"
import { Plus, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { LeaveRequest, LeaveType } from "@/defination/leave"


interface LeaveRequestFormProps {
  leaveTypes: LeaveType[]
  onSubmitRequest: (request: Omit<LeaveRequest, "id" | "userId" | "userName" | "appliedDate" | "status">) => void
}

export default function LeaveRequestForm({ leaveTypes, onSubmitRequest }: LeaveRequestFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedLeaveType, setSelectedLeaveType] = React.useState<string>("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [comments, setComments] = React.useState("")

  const selectedType = leaveTypes.find((type) => type.id === selectedLeaveType)
  const totalDays = startDate && endDate ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1 : 0

  const handleSubmit = () => {
    if (!selectedType || !startDate || !endDate || !reason) return

    onSubmitRequest({
      leaveType: selectedType,
      startDate,
      endDate,
      totalDays,
      reason,
      comments,
    })

    // Reset form
    setSelectedLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
    setComments("")
    setIsOpen(false)
  }

  const isFormValid = selectedLeaveType && startDate && endDate && reason && totalDays > 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Fill in the details for your leave request</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span>{type.name}</span>
                      {type.isSpecial && (
                        <Badge variant="secondary" className="text-xs">
                          Special
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedType && (
              <p className="text-sm text-gray-600 mt-1">
                Max days: {selectedType.maxDays} | {selectedType.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          </div>

          {totalDays > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Total days: <span className="font-semibold">{totalDays}</span>
                {selectedType && totalDays > selectedType.maxDays && (
                  <span className="text-red-600 ml-2">(Exceeds maximum of {selectedType.maxDays} days)</span>
                )}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Any additional information (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid || (selectedType && totalDays > selectedType.maxDays)}>
            <Send className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
