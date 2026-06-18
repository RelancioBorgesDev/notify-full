import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Mail } from "lucide-react";
import { Form } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import type { Template } from "@/http/types/templates/list-templates";
import { useUpdateTemplate } from "@/http/routes/templates/update-templtate";

const templateSchema = z
  .object({
    title: z.string().min(1, "O campo nome é obrigatório"),
    type: z.enum(["EMAIL", "SMS", "PUSH"], { message: "Selecione um tipo" }),
    subject: z.string().optional(),
    content: z
      .string()
      .min(1, "Conteúdo é obrigatório")
      .max(2000, "Conteúdo muito longo"),
    variables: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "EMAIL" &&
      (!data.subject || data.subject.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["subject"],
        message: "Assunto é obrigatório para EMAIL",
      });
    }
  });

type TemplateFormData = z.infer<typeof templateSchema>;

type EditTemplateDialogProps = {
  template: Template;
};

const channelToType = (c?: string): TemplateFormData["type"] => {
  switch ((c || "").toLowerCase()) {
    case "email":
      return "EMAIL";
    case "sms":
      return "SMS";
    case "push":
      return "PUSH";
    default:
      return "EMAIL";
  }
};

export default function EditTemplateDialog({
  template,
}: EditTemplateDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateTemplate();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: template.title || "",
      type: channelToType(template.channel),
      subject: template.subject || "",
      content: template.content || "",
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        title: template.title || "",
        type: channelToType(template.channel),
        subject: template.subject || "",
        content: template.content || "",
      });
    }
  }, [isDialogOpen, template, form]);

  const onSubmit = async (data: TemplateFormData) => {
    try {
      await mutateAsync({
        templateId: template.id,
        data: {
          title: data.title.trim(),
          channel: data.type,
          content: data.content.trim(),
          subject: (data.subject || "").trim(),
        },
      });
      setIsDialogOpen(false);
    } catch {
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Template</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do template"
                  {...form.register("title")}
                />
                <span className="text-sm text-red-500">
                  {form.formState.errors.title?.message}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo do Template</Label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Template de Email
                          </div>
                        </SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="PUSH">Push</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <span className="text-sm text-red-500">
                  {form.formState.errors.type?.message}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Digite o assunto do template"
                  {...form.register("subject")}
                />
                <span className="text-sm text-red-500">
                  {form.formState.errors.subject?.message}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Digite o conteúdo do template"
                  {...form.register("content")}
                />
                <span className="text-sm text-red-500">
                  {form.formState.errors.content?.message}
                </span>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={isPending || form.formState.isSubmitting}
              >
                {isPending || form.formState.isSubmitting
                  ? "Salvando..."
                  : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
