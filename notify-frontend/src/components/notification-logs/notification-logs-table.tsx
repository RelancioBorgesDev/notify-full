import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useListAllLogs } from "@/http/routes/notification-logs/list-all-logs";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function NotificationLogsTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: logs } = useListAllLogs();
  const logsData = logs?.logs ?? [];

  const pageSize = 10;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAIL":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

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

  const filteredLogs = logsData.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
          <CardDescription>
            Filtre e pesquise através dos seus logs de notificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="space-y-2 w-96">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Pesquisar logs..."
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="SUCCESS">Entregues</SelectItem>
                    <SelectItem value="FAIL">Falharam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input type="date" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Entrega</CardTitle>
          <CardDescription>
            Entradas detalhadas de log para todas as entregas de notificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Notification ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tentativa</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Resposta</TableHead>
                <TableHead>Erro</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {log.id}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.notificationId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusBadge(log.status)}>
                          {getStatusText(log.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{log.attempt}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.sentAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{log.response}</TableCell>
                    <TableCell className="text-sm text-red-600">
                      {log.errorMessage || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-6"
                  >
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          {filteredLogs.length > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
