import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes("/overview")) return "overview";
    if (path.includes("/recipients")) return "recipients";
    if (path.includes("/create-notification")) return "create-notification";
    if (path.includes("/create-template")) return "create-template";
    if (path.includes("/logs")) return "logs";
    return "overview";
  };

  return (
    <SidebarProvider>
      <AppSidebar activeView={getActiveView()} setActiveView={getActiveView} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 dark:bg-zinc-900">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
