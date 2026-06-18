import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Send,
  LayoutTemplateIcon as Template,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export function DashboardOverviewPage() {
  const stats = [
    {
      title: "Total De Notificações",
      value: "12,345",
      change: "+12%",
      icon: Bell,
      color: "text-blue-600",
    },
    {
      title: "Enviados Hoje",
      value: "1,234",
      change: "+8%",
      icon: Send,
      color: "text-green-600",
    },
    {
      title: "Templates",
      value: "45",
      change: "+3",
      icon: Template,
      color: "text-purple-600",
    },
    {
      title: "Taxa de Sucesso",
      value: "98.5%",
      change: "+0.5%",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  const recentNotifications = [
    {
      id: "1",
      title: "Welcome Email Campaign",
      status: "delivered",
      recipients: 1250,
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "Password Reset Alert",
      status: "pending",
      recipients: 45,
      time: "5 hours ago",
    },
    {
      id: "3",
      title: "Weekly Newsletter",
      status: "failed",
      recipients: 5000,
      time: "1 day ago",
    },
    {
      id: "4",
      title: "Order Confirmation",
      status: "delivered",
      recipients: 890,
      time: "2 days ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Monitore o desempenho e a atividade do seu sistema de notificação.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>
              Últimas  notificações enviadas e seus status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(notification.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.recipients} recipients •{" "}
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(notification.status)}>
                    {notification.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS Service</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Degraded
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium">145ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
