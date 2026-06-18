import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, Inbox, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListAllLogs } from "@/http/routes/notification-logs/list-all-logs";
import type { Log } from "@/http/types/notification-logs/list-all-logs-response";

export default function NotificationLogsError() {
  const { data: logs, isLoading } = useListAllLogs();
  const logsData = logs?.logs ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Erros</CardTitle>
          <CardDescription>Carregando dados de erro...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      SUCCESS: "bg-green-100 text-green-800",
      FAIL: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      SUCCESS: "Entregue",
      FAIL: "Falhou",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const failedLogs = logsData.filter((log: Log) => log.status === "FAIL");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Erros</CardTitle>
        <CardDescription>
          Erros comuns e padrões de falha na entrega de notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failedLogs.length > 0 ? (
          <div className="space-y-4">
            {failedLogs.map((log: Log) => (
              <div
                key={log.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="p-2 rounded-lg bg-red-100">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.notificationId}</span>
                    <Badge className={getStatusBadge(log.status)}>
                      {getStatusText(log.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.errorMessage}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{new Date(log.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Inbox className="h-8 w-8 mb-2 text-gray-400" />
            <p>Nenhum erro encontrado 🎉</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
