import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatternFormat } from "react-number-format";
import { Edit } from "lucide-react";

const editRecipientSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  pushToken: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Selecione um status",
  }),
});
type EditRecipientFormData = z.infer<typeof editRecipientSchema>;

interface EditRecipientDialogProps {
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientPushToken: string;
  recipientStatus: "ACTIVE" | "INACTIVE";
  onConfirm: (
    id: string,
    updatedData: EditRecipientFormData
  ) => Promise<void> | void;
  trigger: React.ReactNode;
}

export default function EditRecipientDialog({
  recipientId,
  recipientName,
  recipientEmail,
  recipientPhone,
  recipientPushToken,
  recipientStatus,
  onConfirm,
  trigger,
}: EditRecipientDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EditRecipientFormData>({
    resolver: zodResolver(editRecipientSchema),
    defaultValues: {
      name: recipientName,
      email: recipientEmail,
      phone: recipientPhone,
      pushToken: recipientPushToken,
      status: recipientStatus,
    },
    mode: "onChange",
  });

  const handleEditRecipient = async (data: EditRecipientFormData) => {
    setIsSaving(true);
    try {
      await onConfirm(recipientId, data);
      setIsEditDialogOpen(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Destinatário</DialogTitle>
          <DialogDescription>
            Atualize as informações do destinatário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditRecipient)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome completo"
                  {...form.register("name")}
                />
                <span>{form.formState.errors.name?.message}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Endereço de Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite o endereço de email"
                  {...form.register("email")}
                />
                <span>{form.formState.errors.email?.message}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <PatternFormat
                      {...field}
                      format="(##) #####-####"
                      mask="_"
                      placeholder="(00) 00000-0000"
                      customInput={Input}
                    />
                  )}
                />
                <span>{form.formState.errors.phone?.message}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pushToken">Token de Push</Label>
                <Textarea
                  id="pushToken"
                  placeholder="Digite o token de push"
                  {...form.register("pushToken")}
                  className="min-h-[80px]"
                />
                <span>{form.formState.errors.pushToken?.message}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ATIVO</SelectItem>
                        <SelectItem value="INACTIVE">INATIVO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <span>{form.formState.errors.status?.message}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSaving}
                className="disabled:cursor-not-allowed hover:bg-gray-600 disabled:bg-gray-500"
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
