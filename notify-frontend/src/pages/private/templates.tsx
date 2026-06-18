import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTemplate } from "@/components/templates/create-template";
import TemplatesTable from "@/components/templates/templates-table";

export function TemplatesPage() {
  return (
    <Tabs defaultValue="list" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Templates
        </h1>
        <p className="text-muted-foreground">
          Crie e gerencie templates reutilizáveis de notificações para uma
          comunicação consistente.
        </p>
      </div>
      <TabsList>
        <TabsTrigger className="cursor-pointer" value="list">
          Templates
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="create">
          Criar Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <TemplatesTable />
      </TabsContent>

      <TabsContent value="create">
        <CreateTemplate />
      </TabsContent>
    </Tabs>
  );
}
