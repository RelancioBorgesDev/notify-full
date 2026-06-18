import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { useCreateTemplate } from "@/http/routes/templates/create-template";
import { Toaster } from "sonner";

const templateSchema = z
  .object({
    type: z.enum(["EMAIL", "SMS", "PUSH"], {
      message: "Selecione um tipo",
    }),
    subject: z.string().min(1, "Assunto é obrigatório").optional(),
    title: z.string().min(1, "Título é obrigatório"),
    content: z
      .string()
      .min(1, "Conteúdo é obrigatório")
      .max(2000, "Conteúdo muito longo"),
    variables: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "EMAIL" && !data.subject) return false;
      if (data.type === "PUSH" && !data.title) return false;
      return true;
    },
    {
      message: "Campo obrigatório para este tipo de template",
      path: ["subject"],
    }
  );

type TemplateFormData = z.infer<typeof templateSchema>;

export function CreateTemplate() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      type: "EMAIL",
      subject: "",
      content: "",
      variables: [],
    },
  });

  const watchedValues = form.watch();
  const templateType = form.watch("type");
  const createTemplate = useCreateTemplate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      case "SMS":
        return <MessageSquare className="h-4 w-4" />;
      case "PUSH":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      EMAIL: "bg-blue-100 text-blue-800",
      SMS: "bg-green-100 text-green-800",
      PUSH: "bg-purple-100 text-purple-800",
    } as const;
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const togglePreview = () => setIsPreviewOpen((v) => !v);

  const onSubmit = async (data: TemplateFormData) => {
    try {
      await createTemplate.mutateAsync({
        title: data.title,
        channel: data.type,
        content: data.content,
        subject: data.subject || "",
      });
      form.reset();
    } catch {
    }
  };

  const renderPreview = () => {
    if (!watchedValues.type) return null;

    let previewContent = watchedValues.content || "";
    let previewSubject = watchedValues.subject || "";
    let previewTitle = watchedValues.title || "";

    switch (watchedValues.type) {
      case "EMAIL":
        return (
          <div className="border rounded-lg bg-white shadow-sm">
            <div className="bg-gray-50 p-3 border-b rounded-t-lg">
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <span className="font-medium text-gray-600 w-16">De:</span>
                  <span className="text-gray-800">noreply@notify.me</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-gray-600 w-16">Para:</span>
                  <span className="text-gray-800">joao@email.com</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-medium text-gray-600 w-16">
                    Assunto:
                  </span>
                  <span className="text-gray-800 font-medium">
                    {previewSubject || "Assunto do template"}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {previewContent || "Conteúdo do template será exibido aqui..."}
              </div>
            </div>
            <div className="bg-gray-50 p-3 border-t rounded-b-lg">
              <p className="text-xs text-gray-500 text-center">
                Preview do template de email
              </p>
            </div>
          </div>
        );

      case "SMS":
        return (
          <div className="max-w-xs ml-auto">
            <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm shadow-sm">
              <div className="text-sm">
                {previewContent || "Conteúdo do SMS será exibido aqui..."}
              </div>
              <div className="text-xs text-blue-100 mt-1 text-right">agora</div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              SMS Template
            </div>
          </div>
        );

      case "PUSH":
        return (
          <div className="border rounded-lg bg-white shadow-lg max-w-sm">
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">App</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Notify.me
                    </p>
                    <p className="text-xs text-gray-500">agora</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {previewTitle || "Título da notificação"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {previewContent || "Conteúdo da push notification..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Template</CardTitle>
                <CardDescription>
                  Configure os detalhes básicos do seu template de notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Template *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do template"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo do Template *</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                              <SelectItem value="SMS">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Template de SMS
                                </div>
                              </SelectItem>
                              <SelectItem value="PUSH">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4" />
                                  Notificação Push
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {templateType === "EMAIL" && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o assunto do email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {templateType === "PUSH" && (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Push *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título da notificação push"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo do Template *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite o conteúdo do seu template."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização e Ações</CardTitle>
                <CardDescription>
                  Visualize seu template e salve quando estiver pronto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={togglePreview}
                >
                  {isPreviewOpen ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Ocultar Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Mostrar Preview
                    </>
                  )}
                </Button>

                {isPreviewOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {templateType && getTypeIcon(templateType)}
                      <Badge
                        className={
                          templateType ? getTypeBadge(templateType) : ""
                        }
                      >
                        {templateType?.toUpperCase() || "SELECIONE TIPO"}
                      </Badge>
                    </div>
                    {renderPreview()}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={!templateType}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
