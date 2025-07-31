import * as React from "react"
import { useForm } from "react-hook-form"
import { format, parseISO, differenceInDays, isBefore } from "date-fns"
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
import type {  LeaveType } from "@/defination/leave"
import { useSubmitleaveRequestMutation } from "@/store/api/leaveSlice"
import { toast } from "sonner"

interface LeaveRequestFormProps {
  leaveTypes?: LeaveType[]
  appliedLeaveRefetch: () => void
}

type FormValues = {
  leaveType?:  string
  startDate: string
  endDate: string
  reason: string
  comments?: string
}

export default function LeaveRequestForm({ leaveTypes, appliedLeaveRefetch }: LeaveRequestFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [submitLeave] = useSubmitleaveRequestMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      comments: "",
    },
  })

  const watchLeaveType = watch("leaveType")
  const watchStartDate = watch("startDate")
  const watchEndDate = watch("endDate")

  const selectedType = leaveTypes?.find((type) => type.id.toString() === watchLeaveType)

  const totalDays =
    watchStartDate && watchEndDate
      ? differenceInDays(parseISO(watchEndDate), parseISO(watchStartDate)) + 1
      : 0

  const validateEndDate = (endDate: string) => {
    if (!watchStartDate) return "Start date is required first"
    if (isBefore(parseISO(endDate), parseISO(watchStartDate))) {
      return "End date cannot be before start date"
    }
    return true
  }

  const onSubmit = async (data: FormValues) => {
    if (!selectedType) return
    try {
      const resposne = await submitLeave({
        leave_type_id: Number(selectedType.id),
        start_date: data.startDate,
        end_date: data.endDate,
        total_days: totalDays,
        reason: data.reason,
        status: "pending",
        applied_date: format(new Date(), "yyyy-MM-dd"),
        comments: data.comments || "",
      }).unwrap();
      if (!resposne.status) {
        throw new Error(resposne.message || "Failed to submit leave request");
      }
        toast.success(resposne.message || "Failed to submit leave request")
        appliedLeaveRefetch();

    } catch (error: any ) {
      console.log("error",error);
      toast.error(error.data.message || "Failed to submit leave request")
    }

    appliedLeaveRefetch();
    reset()
    setIsOpen(false)
  }

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Leave Type */}
          <div>
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={watchLeaveType} onValueChange={(value) => setValue("leaveType", value.toString(), { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes?.filter((type)=> type.isActive).map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
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
            {errors.leaveType && <p className="text-sm text-red-600 mt-1">{errors.leaveType.message}</p>}
            {selectedType && (
              <p className="text-sm text-gray-600 mt-1">
                Max days: {selectedType.maxDays} | {selectedType.description}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                {...register("startDate", { required: "Start date is required" })}
              />
              {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                min={watchStartDate || format(new Date(), "yyyy-MM-dd")}
                {...register("endDate", {
                  required: "End date is required",
                  validate: validateEndDate,
                })}
              />
              {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Total Days */}
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

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              rows={3}
              placeholder="Please provide a reason for your leave request"
              {...register("reason", { required: "Reason is required" })}
            />
            {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>}
          </div>

          {/* Comments */}
          <div>
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              rows={2}
              placeholder="Any additional information (optional)"
              {...register("comments")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                totalDays <= 0 ||
                (selectedType && totalDays > selectedType.maxDays)
              }
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
