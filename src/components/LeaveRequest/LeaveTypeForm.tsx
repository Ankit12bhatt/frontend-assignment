import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import type { LeaveType } from "@/defination/leave";

const leaveTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["regular", "special"]),
  max_days: z.number().min(1, "Max days must be at least 1"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});

type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>;

interface LeaveTypeFormProps {
  editingLeaveType: LeaveType | null;
  onSubmit: (data: LeaveTypeFormValues) => Promise<void>;
  onCancel: () => void;
}
 const LeaveTypeForm = ({
  editingLeaveType,
  onSubmit,
  onCancel,
}: LeaveTypeFormProps) => {
  const form = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: editingLeaveType?.name || "",
      type: editingLeaveType?.isSpecial ? "special" : "regular",
      max_days: editingLeaveType?.maxDays || 1,
      color: editingLeaveType?.color || "#3b82f6",
      description: editingLeaveType?.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleFormSubmit: SubmitHandler<LeaveTypeFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Annual Leave"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="max_days">Maximum Days</Label>
        <Input
          id="max_days"
          type="number"
          min="1"
          {...register("max_days", { valueAsNumber: true })}
          placeholder="e.g., 30"
        />
        {errors.max_days && (
          <p className="text-sm text-red-500">{errors.max_days.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input id="color" type="color" {...register("color")} />
        {errors.color && (
          <p className="text-sm text-red-500">{errors.color.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="type">Leave Type</Label>
        <select
          {...register("type")}
          id="type"
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="regular">Regular</option>
          <option value="special">Special</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          rows={2}
          placeholder="Brief description of this leave type..."
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : editingLeaveType
            ? "Update"
            : "Add"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default LeaveTypeForm;