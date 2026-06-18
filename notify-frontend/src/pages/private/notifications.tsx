import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateNotification } from "../../components/notifications/create-notification";
import { NotificationsTable } from "@/components/notifications/notifications-table";

export function NotificationsPage() {
  return (
    <Tabs defaultValue="list" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar Notificação</h1>
        <p className="text-muted-foreground">
          Envie notificações direcionadas aos seus usuários por meio de vários
          canais.
        </p>
      </div>
      <TabsList>
        <TabsTrigger className="cursor-pointer" value="list">Notificações</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="create">Criar Notificação</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <NotificationsTable />
      </TabsContent>

      <TabsContent value="create">
        <CreateNotification />
      </TabsContent>
    </Tabs>
  );
}
