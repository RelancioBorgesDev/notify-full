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
import { useDeleteTemplate } from "@/http/routes/templates/delete-template";

type DeleteTemplateDialogProps = {
  templateId: string;
  templateTitle?: string;
  trigger?: React.ReactNode;
  disabled?: boolean;
};

export default function DeleteTemplateDialog({
  templateId,
  templateTitle,
  trigger,
  disabled,
}: DeleteTemplateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const mutationFn = useDeleteTemplate(templateId);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" disabled={disabled}>
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Excluir {templateTitle ? `"${templateTitle}"` : "template"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O template será removido
            permanentemente e não receberá mais notificações.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setLoading(true);
              try {
                await mutationFn.mutateAsync(); 
                setOpen(false);
              } finally {
                setLoading(false);
              }
            }}
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
