import Login from "@/Page/LoginPage";

export const PublicRoute = [
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: "*",
    element: <Login />,
  },

];