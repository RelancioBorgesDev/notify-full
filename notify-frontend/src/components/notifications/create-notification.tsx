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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Calendar as CalendarIcon,
  Send,
  Save,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useListTemplates } from "@/http/routes/templates/list-templates";
import { useCreateNotification } from "@/http/routes/notifications/create-notification";
import { useListAllRecipients } from "@/http/routes/recipients/list-all-recipients";
import type { Recipient } from "@/pages/private/recipients";
const notificationSchema = z
  .object({
    title: z
      .string()
      .min(1, "Título é obrigatório")
      .max(100, "Título muito longo"),
    channel: z.enum(["EMAIL", "SMS", "PUSH"], {
      message: "Selecione um canal",
    }),
    recipientId: z.string().min(1, "Selecione um destinatário"),
    templateId: z.string().min(1, "Selecione um template"),
    content: z
      .string()
      .min(1, "Conteúdo é obrigatório")
      .max(1000, "Conteúdo muito longo"),
    priority: z
      .number()
      .min(1, "Prioridade mínima é 1")
      .max(10, "Prioridade máxima é 10"),
    scheduleEnabled: z.boolean().optional(),
    scheduledDate: z.date().optional(),
    scheduledTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.scheduleEnabled) {
        return data.scheduledDate && data.scheduledTime;
      }
      return true;
    },
    {
      message: "Data e horário são obrigatórios quando agendamento está ativo",
      path: ["scheduledDate"],
    }
  );

type NotificationFormData = z.infer<typeof notificationSchema>;

export function CreateNotification() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { data } = useListTemplates();
  const { mutateAsync: createNotification } = useCreateNotification();
  const { data: recipients } = useListAllRecipients();
  const recipientsData = recipients?.recipients;

  const templates = data?.templates ?? [];

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      channel: undefined,
      recipientId: "",
      templateId: "",
      content: "",
      priority: 5,
      scheduleEnabled: false,
      scheduledDate: undefined,
      scheduledTime: "",
    },
  });

  const watchedValues = form.watch();
  const scheduleEnabled = watchedValues.scheduleEnabled;

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

  const getChannelBadgeColor = (channel: string) => {
    switch (channel) {
      case "EMAIL":
        return "bg-blue-100 text-blue-800";
      case "SMS":
        return "bg-green-100 text-green-800";
      case "PUSH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const onSubmit = async (data: NotificationFormData) => {
    let scheduledAt = "";
    if (data.scheduleEnabled && data.scheduledDate && data.scheduledTime) {
      const date = new Date(data.scheduledDate);
      const [hours, minutes] = data.scheduledTime.split(":");
      date.setHours(parseInt(hours), parseInt(minutes));
      scheduledAt = date.toISOString();
    } else {
      scheduledAt = new Date().toISOString();
    }

    const apiData = {
      recipientId: data.recipientId,
      templateId: data.templateId,
      channel: data.channel,
      title: data.title,
      content: data.content,
      priority: data.priority,
      scheduledAt,
    };

    console.log("Form Data:", apiData);
    await createNotification(apiData);
    form.reset();
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:");
    alert("Rascunho salvo com sucesso!");
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
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Configure os detalhes principais da sua notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex max-md:flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Título da Notificação *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canal *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o canal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="PUSH">Push</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center w-full gap-4 max-xl:flex-col">
                  <FormField
                    control={form.control}
                    name="recipientId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Destinatário *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o destinatário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {recipientsData?.map((recipient: Recipient) => (
                              <SelectItem
                                key={recipient.id}
                                value={recipient?.id!}
                              >
                                {recipient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Template *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(template.channel)}
                                  {template.title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite o conteúdo da notificação..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-40">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Ex: 8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agendamento</CardTitle>
                <CardDescription>
                  Escolha quando mandar sua notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="scheduleEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Agendar para depois
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {scheduleEnabled && (
                  <div className="flex items-start gap-2 max-sm:flex-col">
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-60 max-sm:w-full">
                          <FormLabel>Escolha Data</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "dd/MM/yyyy")
                                    : "Selecionar data"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduledTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col max-sm:w-full">
                          <FormLabel>Horário</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              step={900}
                              className="w-40 max-sm:w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização e Ações</CardTitle>
                <CardDescription>
                  Revise e envie sua notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPreviewOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {watchedValues.channel &&
                          getTypeIcon(watchedValues.channel)}
                        <Badge
                          variant="secondary"
                          className={
                            watchedValues.channel
                              ? getChannelBadgeColor(watchedValues.channel)
                              : ""
                          }
                        >
                          {watchedValues.channel || "PREVIEW"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prioridade: {watchedValues.priority || "5"}
                      </div>
                    </div>

                    {watchedValues.channel === "EMAIL" && (
                      <div className="border rounded-lg bg-white shadow-sm">
                        <div className="bg-gray-50 p-3 border-b rounded-t-lg">
                          <div className="space-y-2">
                            <div className="flex items-center text-xs">
                              <span className="font-medium text-gray-600 w-16">
                                De:
                              </span>
                              <span className="text-gray-800">
                                noreply@empresa.com
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="font-medium text-gray-600 w-16">
                                Para:
                              </span>
                              <span className="text-gray-800">
                                joao.silva@email.com
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="font-medium text-gray-600 w-16">
                                Assunto:
                              </span>
                              <span className="text-gray-800 font-medium">
                                {watchedValues.title || "Assunto do Email"}
                              </span>
                            </div>
                            {scheduleEnabled && watchedValues.scheduledDate && (
                              <div className="flex items-center text-xs">
                                <span className="font-medium text-gray-600 w-16">
                                  Envio:
                                </span>
                                <span className="text-gray-800">
                                  {format(
                                    watchedValues.scheduledDate,
                                    "dd/MM/yyyy"
                                  )}{" "}
                                  às {watchedValues.scheduledTime || "00:00"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                              {watchedValues.content ||
                                "Conteúdo do email será exibido aqui..."}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 border-t rounded-b-lg">
                          <p className="text-xs text-gray-500 text-center">
                            Esta é uma prévia de como seu email aparecerá para o
                            destinatário
                          </p>
                        </div>
                      </div>
                    )}

                    {watchedValues.channel === "SMS" && (
                      <div className="max-w-xs ml-auto">
                        <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm shadow-sm">
                          <div className="text-sm">
                            {watchedValues.content ||
                              "Mensagem SMS será exibida aqui..."}
                          </div>
                          <div className="text-xs text-blue-100 mt-1 text-right">
                            {scheduleEnabled && watchedValues.scheduledDate
                              ? `${format(
                                  watchedValues.scheduledDate,
                                  "dd/MM"
                                )} ${watchedValues.scheduledTime || "00:00"}`
                              : "Agora"}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          SMS
                        </div>
                      </div>
                    )}

                    {watchedValues.channel === "PUSH" && (
                      <div className="border rounded-lg bg-white shadow-lg max-w-sm">
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                App
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  Sua Empresa
                                </p>
                                <p className="text-xs text-gray-500">
                                  {scheduleEnabled &&
                                  watchedValues.scheduledDate
                                    ? `${format(
                                        watchedValues.scheduledDate,
                                        "dd/MM"
                                      )} ${
                                        watchedValues.scheduledTime || "00:00"
                                      }`
                                    : "agora"}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {watchedValues.title || "Título da Notificação"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {watchedValues.content ||
                                  "Conteúdo da push notification será exibido aqui..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!watchedValues.channel && (
                      <div className="p-4 border rounded-lg bg-muted/30 text-center">
                        <div className="text-sm text-muted-foreground">
                          Selecione um canal para visualizar o preview
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent cursor-pointer"
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
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent cursor-pointer"
                    onClick={handleSaveDraft}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Rascunho
                  </Button>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {scheduleEnabled ? "Agendar" : "Enviar Agora"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
