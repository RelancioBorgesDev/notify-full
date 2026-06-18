import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NotificationLogsError from "@/components/notification-logs/notification-logs-errors";
import NotificationLogsTable from "@/components/notification-logs/notification-logs-table";

export function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Logs de Notificação
        </h1>
        <p className="text-muted-foreground">
          Monitore e analise seus logs de entrega de notificações e métricas de
          desempenho.
        </p>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logs">Logs Geral</TabsTrigger>
          <TabsTrigger value="errors">Análise de Erros</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <NotificationLogsTable />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <NotificationLogsError />
        </TabsContent>
      </Tabs>
    </div>
  );
}
