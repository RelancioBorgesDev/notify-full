import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/http/routes/user/user-profile";
import { useLogOut } from "@/http/routes/user/log-out";

export function DashboardHeader() {
  const { data: user } = useUserProfile();
  const logOutMutation = useLogOut();
  const logOut = async () => {
    logOutMutation.mutate();
    window.location.href = "/";
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </div>
          </Button>
        </div>
        <div>
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/diverse-user-avatars.png" />
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
