import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useCreateRecipient } from "@/http/routes/recipients/create-recipient";
import { Badge } from "../ui/badge";

interface ImportResult {
  row: number;
  name: string;
  status: "success" | "error";
  message: string;
}

export default function MassImportRecipients() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createRecipient = useCreateRecipient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResults([]);
    }
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter((line) => line.trim());
    return lines.map((line) => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setResults([]);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        setResults([
          { row: 0, name: "Arquivo", status: "error", message: "Arquivo vazio ou apenas cabeçalho" },
        ]);
        setIsImporting(false);
        return;
      }

      const header = rows[0].map((h) => h.toLowerCase().trim());
      const nameIdx = header.indexOf("name");
      const emailIdx = header.indexOf("email");
      const phoneIdx = header.indexOf("phone");
      const pushTokenIdx = header.indexOf("pushtoken");
      const statusIdx = header.indexOf("status");

      if (nameIdx === -1 || emailIdx === -1) {
        setResults([
          { row: 0, name: "CSV", status: "error", message: "Colunas 'name' e 'email' são obrigatórias" },
        ]);
        setIsImporting(false);
        return;
      }

      const newResults: ImportResult[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = row[nameIdx] || "";
        const email = row[emailIdx] || "";

        if (!name || !email) {
          newResults.push({
            row: i + 1,
            name: name || "desconhecido",
            status: "error",
            message: "Nome e email são obrigatórios",
          });
          continue;
        }

        try {
          await createRecipient.mutateAsync({
            name,
            email,
            phone: phoneIdx >= 0 ? row[phoneIdx] || "" : "",
            pushToken: pushTokenIdx >= 0 ? row[pushTokenIdx] || "" : "",
            status: statusIdx >= 0 && row[statusIdx]?.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
          });
          newResults.push({
            row: i + 1,
            name,
            status: "success",
            message: "Importado com sucesso",
          });
        } catch (err: any) {
          newResults.push({
            row: i + 1,
            name,
            status: "error",
            message: err?.message || "Erro ao importar",
          });
        }
      }

      setResults(newResults);
    } catch (err: any) {
      setResults([
        { row: 0, name: "Arquivo", status: "error", message: err?.message || "Erro ao ler arquivo" },
      ]);
    } finally {
      setIsImporting(false);
    }
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar em massa</CardTitle>
        <CardDescription>
          Importe múltiplos destinatários de um arquivo CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.className += " border-primary"; }}
          onDragLeave={(e) => { e.currentTarget.className = e.currentTarget.className.replace(" border-primary", ""); }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              setSelectedFile(file);
              setResults([]);
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              {selectedFile ? selectedFile.name : "Upload CSV File"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                : "Arraste e solte seu arquivo CSV aqui, ou clique para buscar"}
            </p>
          </div>
        </div>

        {selectedFile && !isImporting && results.length === 0 && (
          <Button onClick={handleImport} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Importar {selectedFile.name}
          </Button>
        )}

        {isImporting && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Importando...
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                {successCount} sucesso{successCount !== 1 ? "s" : ""}
              </Badge>
              {errorCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {errorCount} erro{errorCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {results.map((r, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-sm p-2 rounded ${
                    r.status === "success" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {r.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    Linha {r.row}:
                  </span>
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Formato CSV:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Colunas obrigatórias: name, email</li>
            <li>Colunas opcionais: phone, pushToken, status</li>
            <li>Primeira linha deve conter os cabeçalhos</li>
            <li>Tamanho máximo: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
