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
  Users,
  Loader2,
} from "lucide-react";
import { useGetNotifications } from "@/http/routes/notifications/get-notifications";
import { useListTemplates } from "@/http/routes/templates/list-templates";
import { useListAllLogs } from "@/http/routes/notification-logs/list-all-logs";
import { useListAllRecipients } from "@/http/routes/recipients/list-all-recipients";

export function DashboardOverviewPage() {
  const { data: notificationsData, isLoading: notifLoading } = useGetNotifications();
  const { data: templatesData, isLoading: tmplLoading } = useListTemplates();
  const { data: logsData, isLoading: logsLoading } = useListAllLogs();
  const { data: recipientsData, isLoading: recLoading } = useListAllRecipients();

  const notifications = notificationsData ?? [];
  const templates = templatesData?.templates ?? [];
  const logs = logsData?.logs ?? [];
  const recipients = recipientsData?.recipients ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sentToday = notifications.filter(
    (n) => new Date(n.createdAt) >= today
  ).length;

  const successCount = logs.filter((l) => l.status === "SUCCESS").length;
  const successRate = logs.length > 0
    ? ((successCount / logs.length) * 100).toFixed(1)
    : "0.0";

  const recentNotifications = notifications.slice(0, 4);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SENT: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      FAILED: "bg-red-100 text-red-800",
      READ: "bg-blue-100 text-blue-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      SENT: "Enviado",
      PENDING: "Pendente",
      FAILED: "Falhou",
      READ: "Lido",
    };
    return labels[status] || status;
  };

  const isLoading = notifLoading || tmplLoading || logsLoading || recLoading;

  const stats = [
    {
      title: "Total De Notificações",
      value: notifications.length.toLocaleString(),
      icon: Bell,
      color: "text-blue-600",
    },
    {
      title: "Enviados Hoje",
      value: sentToday.toLocaleString(),
      icon: Send,
      color: "text-green-600",
    },
    {
      title: "Templates",
      value: templates.length.toString(),
      icon: Template,
      color: "text-purple-600",
    },
    {
      title: "Taxa de Sucesso",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                {recipients.length} destinatários cadastrados
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
              Últimas notificações enviadas e seus status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.recipientId + notification.createdAt}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(notification.status)}
                      <div>
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.channel} • {new Date(notification.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(notification.status)}>
                      {getStatusLabel(notification.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma notificação encontrada
              </p>
            )}
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
                <span className="text-sm">Total de Logs</span>
                <span className="text-sm font-medium">{logs.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
