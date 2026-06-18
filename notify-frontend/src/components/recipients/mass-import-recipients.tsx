import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export default function MassImportRecipients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar em massa</CardTitle>
        <CardDescription>
          Importe múltiplos destinatários de um arquivo CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Upload CSV File</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          <Button className="mt-4">Choose File</Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">CSV Format Requirements:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Columns: name, email, phone, pushToken</li>
            <li>First row should contain column headers</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
