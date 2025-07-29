import { useEffect, useMemo, useState } from "react";
import { useNavigate, useRoutes, useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setUser } from "@/store/reducer/userReducer";
import { useLazyGetCurrentUserQuery } from "@/store/api/authSlice";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { parseApiErrorMessage } from "@/helper/error";
import type { ApiError } from "@/defination/authApiResponse";
import { privateRoutes } from "./privateRoute";
import { PublicRoute } from "./publicRoute";

// Define user roles
export const UserRole = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

interface JWTPayload {
  role: UserRole;
  userId: string;
  exp: number;
  iat: number;
}

const AppRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [getUser, { isLoading }] = useLazyGetCurrentUserQuery();
  const { user } = useSelector((state: RootState) => state.user);
  const [authChecked, setAuthChecked] = useState(false);
  const token = localStorage.getItem("token");

  const userRole = useMemo(() => {
    if (!token || token === "null") return null;
    try {
      const decoded: JWTPayload = jwtDecode(token);
      return decoded.role;
    } catch {
      return null;
    }
  }, [token]);

  const isAuthenticated = useMemo(() => {
    return !!token && token !== "null" && !!user;
  }, [token, user]);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!user && localUser) {
      dispatch(setUser(JSON.parse(localUser)));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && token !== "null" && !user && !isLoading) {
        try {
          const res = await getUser().unwrap();
          dispatch(setUser(res.data));
        } catch (error) {
          toast.error(parseApiErrorMessage(error as ApiError) || "Session expired");
          dispatch(logOut());
          navigate("/auth/login");
        }
      }
      setAuthChecked(true);
    };

    fetchUser();
  }, [token, user, getUser, isLoading, navigate]);

  // Redirect based on auth + role
  useEffect(() => {
    if (!authChecked) return;

    const path = location.pathname;

    // Not authenticated
    if (!isAuthenticated) {
      if (!path.startsWith("/auth")) {
        navigate("/auth/login");
      }
      return;
    }

    // Authenticated and trying to access wrong section
    if (userRole === UserRole.ADMIN && path.startsWith("/admin")) {
      navigate("/admin/dashboard");
    } else if (userRole === UserRole.EMPLOYEE && path.startsWith("/employee")) {
      navigate("/employee/dashboard");
    }

    // Root or wildcard
    if (path === "/" || path === "*") {
      if (userRole === UserRole.ADMIN) {
        navigate("/admin/dashboard");
      } else if (userRole === UserRole.EMPLOYEE) {
        navigate("/employee/dashboard");
      }
    }
  }, [authChecked, isAuthenticated, location.pathname, userRole, navigate]);

  // Routes to load
  const routes = useMemo(() => {
    if (!isAuthenticated) return PublicRoute;

    return privateRoutes.filter((route) => {
      if (route.path?.startsWith("/admin")) return userRole === UserRole.ADMIN;
      if (route.path?.startsWith("/employee")) return userRole === UserRole.EMPLOYEE;
      return true; // common
    });
  }, [isAuthenticated, userRole]);

  const routing = useRoutes(routes);

  if (!authChecked) return <div>Loading...</div>;

  return routing ?? <Navigate to="/" />;
};

export default AppRoute;
