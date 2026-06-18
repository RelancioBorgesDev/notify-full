import {
  BarChart3,
  Plus,
  LayoutTemplateIcon as Template,
  Eye,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Logo from "./logo";
import { useTheme } from "./theme-provider";
import { Link } from "react-router";

const navigationItems = [
  {
    title: "Visão Geral",
    icon: BarChart3,
    id: "overview",
  },
  {
    title: "Destinatários",
    icon: Users,
    id: "recipients",
  },
  {
    title: "Notificações",
    icon: Plus,
    id: "create-notification",
  },
  {
    title: "Templates",
    icon: Template,
    id: "create-template",
  },
  {
    title: "Logs",
    icon: Eye,
    id: "logs",
  },
];

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const { theme } = useTheme();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex flex-col">
            <Logo type={theme === "dark" ? "dark" : "light"} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                  >
                    <Link
                      to={`/dashboard/${item.id}`}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-8">
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
