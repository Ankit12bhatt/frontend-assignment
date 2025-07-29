"use client";

import * as React from "react";
import { UserPlus, Edit, Trash2, Search, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/defination/leave";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRegisterUserMutation } from "@/store/api/authSlice";
import { toast } from "sonner";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/store/api/userSlice";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "employee"]),
  department: z.string().optional(),
  position: z.string().optional(),
  employee_id: z.string().min(1, "Employee ID is required"),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type FormValuesUser = z.infer<typeof schema>;

interface UserManagementProps {
  users: User[];
  fetch: () => void; 
}

const UserManagement = ({ users, fetch }: UserManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [registerUser] = useRegisterUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValuesUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
      department: "",
      position: "",
      employee_id: "",
      phone: "",
      is_active: true,
    },
  });

  const departments = Array.from(new Set(users.map((u) => u.department)));

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || user.department === departmentFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  const onSubmit = async (data: FormValuesUser) => {
    try {
      if (editingUser) {
        const response = await updateUser({
          id: Number(editingUser.id),
          data: {
            ...data,
            role: data.role === "employee" ? "employee" : data.role,
            is_active: data.is_active ?? false,
            department: data.department ?? "",
            position: data.position ?? "",
            phone: data.phone ?? "",
          },
        }).unwrap();
        if (!response.status) {
          throw new Error(response.message || "Failed to update user");
        }
        toast.success(response.message || "User updated successfully");
      } else {
        const response = await registerUser(data).unwrap();
        if (!response.status) {
          throw new Error(response.message || "Failed to create user");
        }
        toast.success(response.message || "User created successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      return;
    } finally {
      setIsDialogOpen(false);
      reset();
      fetch();
      setEditingUser(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("department", user.department);
    setValue("position", user.position);
    setValue("employee_id", user.employeeId);
    setValue("phone", user.phone || "");
    setValue("is_active", user.is_active);
    setValue("password", "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      if (confirm("Are you sure you want to delete this user?")) {
        const response = await deleteUser(Number(userId)).unwrap();
        if (!response.status) {
          throw new Error(response.message || "Failed to delete user");
        }
        toast.success("User deleted successfully");
        fetch();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting user");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Add, edit, and manage user accounts
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => reset()}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Edit User" : "Add User"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "Update user information"
                      : "Create a new user account"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Employee ID *</Label>
                    <Input {...register("employee_id")} />
                    {errors.employee_id && (
                      <p className="text-sm text-red-500">
                        {errors.employee_id.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input {...register("email")} type="email" />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input {...register("password")} type="password" />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input {...register("phone")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select
                      value={watch("role")}
                      onValueChange={(val: "admin" | "employee") =>
                        setValue("role", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input {...register("department")} />
                  </div>
                </div>
                <div>
                  <Label>Position</Label>
                  <Input {...register("position")} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={watch("is_active")}
                    onCheckedChange={(checked) =>
                      setValue("is_active", checked)
                    }
                  />
                  <Label>Active User</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUser ? "Update" : "Create"} User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments
                  .filter((dept) => dept && dept.trim() !== "") // remove empty/null/undefined
                  .map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      {!user.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                      {user.role === "admin" && (
                        <Badge className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-100">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.position} • {user.department} • ID:{" "}
                      {user.employeeId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.is_active}
                    onCheckedChange={(checked) =>
                      setValue("is_active", checked)
                    }
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default UserManagement;
