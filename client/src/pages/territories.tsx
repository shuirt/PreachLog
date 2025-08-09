import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartBar, Plus, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewTerritoryModal from "@/components/modals/new-territory-modal";
import { Link } from "wouter";

export default function Territories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewTerritory, setShowNewTerritory] = useState(false);

  // Get territories
  const { data: territories = [] } = useQuery({
    queryKey: ["/api/territories"],
  });

  const filteredTerritories = territories.filter((territory: any) => {
    const matchesSearch = territory.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "not_started":
          matchesStatus = territory.completionRate === 0;
          break;
        case "in_progress":
          matchesStatus = territory.completionRate > 0 && territory.completionRate < 100;
          break;
        case "completed":
          matchesStatus = territory.completionRate === 100;
          break;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (territory: any) => {
    if (territory.completionRate === 0) {
      return <Badge variant="secondary">PENDENTE</Badge>;
    } else if (territory.completionRate === 100) {
      return <Badge className="bg-green-100 text-green-800">CONCLUÍDO</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">EM PROGRESSO</Badge>;
    }
  };

  const getProgressColor = (rate: number) => {
    if (rate === 0) return "bg-gray-400";
    if (rate === 100) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Territórios</h2>
          <p className="text-gray-600">Gerencie o progresso dos territórios</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/reports">
            <Button variant="outline">
              <ChartBar className="mr-2" size={16} />
              Estatísticas
            </Button>
          </Link>
          <Button onClick={() => setShowNewTerritory(true)}>
            <Plus className="mr-2" size={16} />
            Novo Território
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Buscar território..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="not_started">Não Iniciado</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Territories Grid */}
      {filteredTerritories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {territories.length === 0 ? "Nenhum Território Cadastrado" : "Nenhum Território Encontrado"}
            </h3>
            <p className="text-gray-600 mb-4">
              {territories.length === 0 
                ? "Comece criando seu primeiro território de pregação."
                : "Tente ajustar os filtros para encontrar territórios."
              }
            </p>
            {territories.length === 0 && (
              <Button onClick={() => setShowNewTerritory(true)}>
                <Plus className="mr-2" size={16} />
                Criar Primeiro Território
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTerritories.map((territory: any) => (
            <Card key={territory.id} className="hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {territory.mapImageUrl ? (
                  <img 
                    src={territory.mapImageUrl} 
                    alt={`Mapa de ${territory.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Mapa não disponível</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{territory.name}</h3>
                    <p className="text-sm text-gray-600">{territory.totalBlocks} quadras totais</p>
                  </div>
                  {getStatusBadge(territory)}
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">
                      {territory.completedBlocks}/{territory.totalBlocks} ({territory.completionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(territory.completionRate)}`}
                      style={{ width: `${territory.completionRate}%` }}
                    />
                  </div>
                </div>
                
                {/* Territory Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Última trabalhada:</span>
                    <span className="text-gray-900">
                      {territory.lastWorkedAt 
                        ? format(new Date(territory.lastWorkedAt), "dd/MM/yyyy", { locale: ptBR })
                        : "Nunca"
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quadras restantes:</span>
                    <span className="text-gray-900">{territory.totalBlocks - territory.completedBlocks}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button className="flex-1" size="sm">
                    {territory.completionRate === 0 ? "Iniciar" : "Atualizar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewTerritoryModal
        open={showNewTerritory}
        onOpenChange={setShowNewTerritory}
      />
    </div>
  );
}
