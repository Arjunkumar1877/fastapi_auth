import { useRoutes } from "react-router-dom"
import Register from "./routes/Register"
import Login from "./routes/Login"
import NotFound from "./routes/NotFound"
import Dashboard from "./routes/Dashboard"
import Profile from "./routes/Profile"
import Tasks from "./routes/Tasks"
import { ProtectedRoute, PublicOnlyRoute } from "./auth/Routes"
import DashboardLayout from "./components/layout/DashboardLayout"
import Settings from "./routes/Settings"

export default function App() {
  const protectedRoute = ProtectedRoute()
  const publicRoute = PublicOnlyRoute()

  const routes = [
    {
      path: "/",
      element: publicRoute,
      children: [
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
      ]
    },
    {
      path: "/",
      element: protectedRoute,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: 'profile', element: <Profile /> },
            { path: 'tasks', element: <Tasks /> },
            { path: 'settings', element: <Settings /> },
          ]
        }
      ]
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]
  const routing = useRoutes(routes);
  return <>{routing}</>;
}