import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Inbox, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListAllLogs } from "@/http/routes/notification-logs/list-all-logs";
import type { Log } from "@/http/types/notification-logs/list-all-logs-response";

export default function NotificationLogsError() {
  const { data: logs, isLoading } = useListAllLogs();
  const logsData = logs?.logs ?? [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const pageSize = 10;

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
    const variants: Record<string, string> = {
      SUCCESS: "bg-green-100 text-green-800",
      FAIL: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      SUCCESS: "Entregue",
      FAIL: "Falhou",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const failedLogs = logsData.filter((log: Log) => log.status === "FAIL");
  const totalPages = Math.ceil(failedLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = failedLogs.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Análise de Erros</CardTitle>
          <CardDescription>
            Erros comuns e padrões de falha na entrega de notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedLogs.length > 0 ? (
            <div className="space-y-4">
              {paginatedLogs.map((log: Log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedLog(log)}
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
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

          {failedLogs.length > pageSize && (
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

      <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Detalhes do Erro
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre a falha de entrega
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground mb-1">ID do Log</p>
                  <p className="font-mono text-xs">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Notificação</p>
                  <p className="font-mono text-xs">{selectedLog.notificationId}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Tentativa</p>
                  <p>{selectedLog.attempt}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusBadge(selectedLog.status)}>
                    {getStatusText(selectedLog.status)}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Enviado em</p>
                  <p>{new Date(selectedLog.sentAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Criado em</p>
                  <p>{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-muted-foreground text-sm mb-1">Mensagem de Erro</p>
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800">{selectedLog.errorMessage}</p>
                </div>
              </div>

              {selectedLog.response && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm mb-1">Resposta da API</p>
                  <pre className="p-3 rounded-md bg-muted text-xs overflow-x-auto max-h-32">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedLog.response), null, 2);
                      } catch {
                        return selectedLog.response;
                      }
                    })()}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
