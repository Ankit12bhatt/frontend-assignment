import AdminDashboard from "@/Page/Dashboard/AdminDashboard";
import EmployeeDashboard from "@/Page/Dashboard/EmployeeDashboard";
import { Navigate } from "react-router-dom";

export const privateRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

