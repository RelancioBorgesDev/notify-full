import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteRecipient } from "@/http/routes/recipients/delete-recipient";

type DeleteRecipientDialogProps = {
  recipientId: string;
  recipientName?: string;
  onConfirm: (recipientId: string) => Promise<void> | void;
  trigger?: React.ReactNode;
  disabled?: boolean;
};

export default function DeleteRecipientDialog({
  recipientId,
  recipientName,
  onConfirm,
  trigger,
  disabled,
}: DeleteRecipientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const mutationFn = useDeleteRecipient(recipientId);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await mutationFn.mutateAsync();
      onConfirm?.(recipientId);
      setOpen(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" size="sm" disabled={disabled}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Excluir {recipientName ? `"${recipientName}"` : "destinatário"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O destinatário será removido
            permanentemente e não receberá mais notificações.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
