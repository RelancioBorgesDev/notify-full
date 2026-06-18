import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ListRecipients from "@/components/recipients/recipients-table";
import MassImportRecipients from "@/components/recipients/mass-import-recipients";
import CreateRecipient from "@/components/recipients/create-recipient";

export interface Recipient {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  pushToken?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export function RecipientsPage() {
  return (
    <div className="space-y-6">
      <CreateRecipient />
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Destinatários</TabsTrigger>
          <TabsTrigger value="import">Importar em massa</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <ListRecipients />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <MassImportRecipients />
        </TabsContent>
      </Tabs>
    </div>
  );
}
