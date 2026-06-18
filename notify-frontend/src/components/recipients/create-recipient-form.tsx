import { Plus } from "lucide-react";
import { Button } from "../ui/button";
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
import { useState } from "react";
import { useCreateRecipient } from "@/http/routes/recipients/create-recipient";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PatternFormat } from "react-number-format";

const createRecipientSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z.email("E-mail inválido"),
  phone: z.string().optional(),
  pushToken: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Selecione um status",
  }),
});
type CreateRecipientFormData = z.infer<typeof createRecipientSchema>;

export default function CreateRecipientForm() {
  const mutationFn = useCreateRecipient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const form = useForm<CreateRecipientFormData>({
    resolver: zodResolver(createRecipientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      pushToken: "",
      status: "ACTIVE",
    },
    mode: "onChange",
  });

  const handleAddRecipient = async () => {
    await mutationFn.mutateAsync({
      name: form.getValues("name"),
      email: form.getValues("email"),
      phone: form.getValues("phone") ?? "",
      pushToken: form.getValues("pushToken") ?? "",
      status: form.getValues("status"),
    });
    form.reset();
    setIsAddDialogOpen(false);
  };
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Criar destinatário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Destinatário</DialogTitle>
          <DialogDescription>
            Adicione um novo destinatário à sua lista de notificações.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddRecipient)}>
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
                  defaultValue="ACTIVE"
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
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  mutationFn.isPending ||
                  !form.formState.isValid
                }
                className="disabled:cursor-not-allowed hover:bg-gray-600 disabled:bg-gray-500"
              >
                Adicionar Destinatário
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
