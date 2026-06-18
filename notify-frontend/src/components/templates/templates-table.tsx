import {
  Mail,
  MessageSquare,
  Smartphone,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useListTemplates } from "@/http/routes/templates/list-templates";
import EditTemplateDialog from "./edit-template-dialog";
import DeleteTemplateDialog from "./delete-template-dialog";
import { Loader2 } from "lucide-react";

export default function TemplatesTable() {
  const { data: templates, isLoading } = useListTemplates();
  const templateData = templates?.templates;

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastModified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const colors: Record<string, string> = {
      EMAIL: "bg-blue-100 text-blue-800",
      SMS: "bg-green-100 text-green-800",
      PUSH: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      EMAIL: "Email",
      SMS: "SMS",
      PUSH: "Push",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 dia atrás";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} semana${
        Math.floor(diffDays / 7) > 1 ? "s" : ""
      } atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const getFilteredAndSortedTemplates = () => {
    let filtered = templateData?.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.subject &&
          template.subject.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        typeFilter === "all" || template.channel.toUpperCase() === typeFilter.toUpperCase();

      return matchesSearch && matchesType;
    });

    filtered?.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "lastModified":
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "type":
          aValue = a.channel;
          bValue = b.channel;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredTemplates = getFilteredAndSortedTemplates() || [];

  const totalPages = Math.ceil(filteredTemplates?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
          <CardDescription>
            Encontre rapidamente o template que você precisa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="w-xl relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, conteúdo ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="EMAIL">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="SMS">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="PUSH">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Push
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-");
                    setSortBy(field);
                    setSortOrder(order as "asc" | "desc");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastModified-desc">
                      Modificado Recentemente
                    </SelectItem>
                    <SelectItem value="lastModified-asc">
                      Modificado Antigamente
                    </SelectItem>
                    <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="createdAt-desc">
                      Criado Recentemente
                    </SelectItem>
                    <SelectItem value="createdAt-asc">
                      Criado Antigamente
                    </SelectItem>
                    <SelectItem value="type-asc">Tipo (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Mostrando {filteredTemplates?.length} de {templateData?.length}{" "}
              templates
              {searchTerm && ` para "${searchTerm}"`}
              {typeFilter !== "all" && ` do tipo ${getTypeLabel(typeFilter)}`}
            </div>
            {(searchTerm || typeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Templates Existentes ({filteredTemplates.length})
              </CardTitle>
              <CardDescription>
                Visualize, edite ou exclua seus templates salvos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {paginatedTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between py-4 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(template.channel)}
                    <Badge className={getTypeBadge(template.channel)}>
                      {getTypeLabel(template.channel)}
                    </Badge>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1">
                      {template.title}
                    </div>
                    {template.subject && (
                      <div className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">Assunto:</span>{" "}
                        {template.subject}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {template.content.substring(0, 120)}
                      {template.content.length > 120 && "..."}
                    </div>
                    <div className="flex items-center flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>Modificado:</span>
                        <span className="font-medium">
                          {formatDate(template.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <EditTemplateDialog template={template} />
                  <DeleteTemplateDialog
                    templateId={template.id}
                    templateTitle={template.title}
                  />
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                Nenhum template encontrado
              </div>
            )}
          </div>

          {filteredTemplates.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <span>
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="disabled:cursor-not-allowed cursor-pointer"
              >
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
