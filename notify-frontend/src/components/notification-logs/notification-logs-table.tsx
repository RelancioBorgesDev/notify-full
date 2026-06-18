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
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { useListAllLogs } from "@/http/routes/notification-logs/list-all-logs";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function NotificationLogsTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: logs, isLoading, refetch, isRefetching } = useListAllLogs();
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
    const variants: Record<string, string> = {
      SUCCESS: "bg-green-100 text-green-800",
      FAIL: "bg-red-100 text-red-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      SUCCESS: "Entregue",
      FAIL: "Falhou",
    };
    return statusTexts[status] || status;
  };

  const filteredLogs = useMemo(() => {
    return logsData.filter((log) => {
      if (statusFilter !== "all" && log.status !== statusFilter) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          log.id.toLowerCase().includes(term) ||
          log.notificationId.toLowerCase().includes(term) ||
          log.errorMessage?.toLowerCase().includes(term) ||
          log.response?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      if (startDate) {
        const logDate = new Date(log.createdAt);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }

      if (endDate) {
        const logDate = new Date(log.createdAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }

      return true;
    });
  }, [logsData, statusFilter, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  const handleExport = () => {
    const header = "ID,Notification ID,Status,Tentativa,Enviado em,Resposta,Erro,Criado em";
    const rows = filteredLogs.map((log) =>
      [
        log.id,
        log.notificationId,
        log.status,
        log.attempt,
        new Date(log.sentAt).toISOString(),
        `"${(log.response || "").replace(/"/g, '""')}"`,
        `"${(log.errorMessage || "").replace(/"/g, '""')}"`,
        new Date(log.createdAt).toISOString(),
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notificacao-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refetch();
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

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
          <div className="flex justify-between max-lg:flex-col gap-4">
            <div className="space-y-2 w-96 max-lg:w-full">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Pesquisar logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex items-end justify-end gap-2 max-lg:flex-wrap">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
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
                <Input type="date" value={startDate} onChange={handleStartDateChange} />
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input type="date" value={endDate} onChange={handleEndDateChange} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              {isRefetching ? "Atualizando..." : "Atualizar"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredLogs.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <span className="text-sm text-muted-foreground self-end ml-2">
              {filteredLogs.length} de {logsData.length} registros
            </span>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                        {log.id.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.notificationId.slice(0, 12)}...
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
                      <TableCell className="text-sm text-red-600 max-w-[200px] truncate">
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
                      {searchTerm || startDate || endDate || statusFilter !== "all"
                        ? "Nenhum log encontrado para os filtros aplicados"
                        : "Nenhum log encontrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredLogs.length > pageSize && (
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
