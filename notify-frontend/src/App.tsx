import { Navigate, Route, Routes } from "react-router";
import { Login } from "./pages/public/login";
import { Register } from "./pages/public/register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { useUserProfile } from "./http/routes/user/user-profile";
import type { JSX } from "react";
import DashboardLayout from "./layouts/dashboard-layout";
import { LogsPage } from "./pages/private/logs";
import { DashboardOverviewPage } from "./pages/private/overview";
import { NotificationsPage } from "./pages/private/notifications";
import { TemplatesPage } from "./pages/private/templates";
import { LoadingSpinner } from "./components/loading-spinner";
import { RecipientsPage } from "./pages/private/recipients";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoading, isError } = useUserProfile();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Navigate to="/" replace />;

  return children;
}

export const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverviewPage />} />
            <Route path="recipients" element={<RecipientsPage />} />
            <Route path="create-notification" element={<NotificationsPage />} />
            <Route path="create-template" element={<TemplatesPage />} />
            <Route path="logs" element={<LogsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
