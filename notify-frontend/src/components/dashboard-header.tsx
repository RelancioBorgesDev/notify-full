import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Search, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/http/routes/user/user-profile";
import { useLogOut } from "@/http/routes/user/log-out";
import { useGetNotifications } from "@/http/routes/notifications/get-notifications";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

export function DashboardHeader() {
  const { data: user } = useUserProfile();
  const logOutMutation = useLogOut();
  const { data: notifications, isLoading: notifLoading } = useGetNotifications();
  const recentNotifications = (notifications ?? []).slice(0, 5);

  const logOut = async () => {
    logOutMutation.mutate();
    window.location.href = "/";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT": return <CheckCircle className="h-3 w-3 text-green-600" />;
      case "FAILED": return <XCircle className="h-3 w-3 text-red-600" />;
      default: return <Clock className="h-3 w-3 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { SENT: "Enviado", PENDING: "Pendente", FAILED: "Falhou", READ: "Lido" };
    return labels[status] || status;
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 dark:bg-zinc-900">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2 px-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquise notificações, templates..."
            className="pl-8"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {notifications.filter(n => n.status === "FAILED" || n.status === "PENDING").length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações Recentes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : recentNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma notificação</p>
              ) : (
                recentNotifications.map((n, i) => (
                  <DropdownMenuItem key={n.recipientId + i} className="cursor-pointer" asChild>
                    <Link to="/dashboard/create-notification" className="flex items-start gap-2 py-2">
                      {getStatusIcon(n.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {getStatusLabel(n.status)} • {n.channel}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/logs" className="text-sm text-center w-full justify-center">
                  Ver todos os logs
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-(--radix-popper-anchor-width)"
          >
            <DropdownMenuItem onClick={logOut} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2 text-red-500" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
