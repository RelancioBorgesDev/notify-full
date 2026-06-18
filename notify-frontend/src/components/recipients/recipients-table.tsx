import type { ColumnDef } from "@tanstack/react-table";

import { Edit, Mail, Phone, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { DataTable } from "../tables/data-table";
import { useListAllRecipients } from "@/http/routes/recipients/list-all-recipients";
import { Checkbox } from "../ui/checkbox";
import DeleteRecipientDialog from "./delete-recipient-dialog";
import EditRecipientDialog from "./edit-recipient-dialog";
import { useUpdateRecipient } from "@/http/routes/recipients/update-recipient";

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  pushToken: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function ListRecipients() {
  const { data, isLoading } = useListAllRecipients();
  const { mutateAsync: updateRecipient } = useUpdateRecipient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const columns: ColumnDef<Recipient>[] = [
    {
      id: "select",
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div>
            <div className="font-medium">{value.slice(0, 12)}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div>
            <div className="font-medium">{value}</div>
          </div>
        );
      },
    },
    {
      id: "contact",
      header: "Contato",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      id: "pushToken",
      header: "Push Token",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <code className="text-xs bg-muted px-1 rounded">
            {row.original.pushToken
              ? row.original.pushToken.slice(0, 12) + "..."
              : "Nenhum"}
          </code>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <Badge className={getStatusBadge(value)}>
            {value === "ACTIVE" ? "ATIVO" : "INATIVO"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <EditRecipientDialog
            recipientId={row.original.id}
            recipientName={row.original.name}
            recipientEmail={row.original.email}
            recipientPhone={row.original.phone}
            recipientPushToken={row.original.pushToken}
            recipientStatus={row.original.status}
            onConfirm={async (id, updatedData) => {
              await updateRecipient({
                recipientId: id,
                data: updatedData,
              });
            }}
            trigger={
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />

          <DeleteRecipientDialog
            recipientId={row.original.id}
            recipientName={row.original.name}
            onConfirm={async () => {}}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.recipients || []}
      searchPlaceholder="Pesquise por nome, email ou telefone..."
      enableRowSelection={true}
      enableMultiSort={false}
      initialSorting={[]}
    />
  );
}
