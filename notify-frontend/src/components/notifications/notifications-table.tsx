import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "../tables/sortable-header";
import { DataTable } from "../tables/data-table";
import { useGetNotifications } from "@/http/routes/notifications/get-notifications";
import type { Notification } from "@/http/types/notifications/get-notifications-response";
import { NotificationsTableSkeleton } from "./notifications-table-skeleton";

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    PENDING: { variant: "secondary", label: "Pendente" },
    SENT: { variant: "default", label: "Enviado" },
    FAILED: { variant: "destructive", label: "Falhou" },
    READ: { variant: "outline", label: "Lido" },
  };

  const config = variants[status] || {
    variant: "outline",
    label: status,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getChannelBadge = (channel: string) => {
  const variants = {
    EMAIL: { variant: "outline" as const, label: "Email" },
    SMS: { variant: "secondary" as const, label: "SMS" },
    PUSH: { variant: "default" as const, label: "Push" },
  };

  const config = variants[channel as keyof typeof variants] || {
    variant: "outline" as const,
    label: channel,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function NotificationsTable() {
  const { data, isLoading } = useGetNotifications();

  const columns: ColumnDef<Notification>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column}>Título</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "channel",
      header: ({ column }) => (
        <SortableHeader column={column}>Canal</SortableHeader>
      ),
      cell: ({ row }) => getChannelBadge(row.getValue("channel")),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "recipientData",
      header: "Destinatário",
      cell: ({ row }) => {
        const recipient = row.getValue("recipientData") as {
          email: string;
        };
        return <div className="max-w-[150px] truncate">{recipient.email}</div>;
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader column={column}>Criado em</SortableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <div className="whitespace-nowrap">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(date))}{" "}
          </div>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId) as string | Date);
        const dateB = new Date(rowB.getValue(columnId) as string | Date);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <SortableHeader column={column}>Prioridade</SortableHeader>
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number;
        return (
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                priority >= 8
                  ? "bg-red-500"
                  : priority >= 6
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <span>{priority}</span>
          </div>
        );
      },
      sortingFn: "basic",
    },
  ];

  const handleRowSelectionChange = () => {};

  if (isLoading) {
    return <NotificationsTableSkeleton />;
  }

  const notifications = data || [];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={notifications}
        searchPlaceholder="Buscar notificações..."
        enableRowSelection={true}
        enableMultiSort={true}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowSelectionChange={handleRowSelectionChange}
      />
    </div>
  );
}
