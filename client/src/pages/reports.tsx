import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Users, MapPin, Clock, TrendingUp, ChartBar, FileText } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30");
  const [selectedTerritory, setSelectedTerritory] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Get data for reports
  const { data: territories = [] } = useQuery({
    queryKey: ["/api/territories"],
  });

  const { data: preachingDays = [] } = useQuery({
    queryKey: ["/api/preaching-days"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Calculate report data
  const getDateRangeFilter = () => {
    const today = new Date();
    switch (dateRange) {
      case "last7":
        return { start: subDays(today, 7), end: today };
      case "last30":
        return { start: subDays(today, 30), end: today };
      case "thisMonth":
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "custom":
        return { start: customStartDate || subDays(today, 30), end: customEndDate || today };
      default:
        return { start: subDays(today, 30), end: today };
    }
  };

  const { start: filterStart, end: filterEnd } = getDateRangeFilter();

  const filteredPreachingDays = preachingDays.filter((day: any) => {
    const dayDate = new Date(day.date);
    const inDateRange = dayDate >= filterStart && dayDate <= filterEnd;
    const inTerritory = selectedTerritory === "all" || day.territoryId === selectedTerritory;
    return inDateRange && inTerritory;
  });

  // Statistics
  const totalActivities = filteredPreachingDays.length;
  const completedActivities = filteredPreachingDays.filter((day: any) => day.status === "COMPLETED").length;
  const totalParticipations = filteredPreachingDays.reduce((acc: number, day: any) => acc + (day.participations?.length || 0), 0);
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  // Territory stats
  const territoryStats = territories.map((territory: any) => {
    const territoryActivities = filteredPreachingDays.filter((day: any) => day.territoryId === territory.id);
    const completed = territoryActivities.filter((day: any) => day.status === "COMPLETED").length;
    return {
      ...territory,
      activities: territoryActivities.length,
      completed,
      rate: territoryActivities.length > 0 ? (completed / territoryActivities.length) * 100 : 0
    };
  });

  // User participation stats
  const userStats = users.map((user: any) => {
    const userParticipations = filteredPreachingDays.filter((day: any) => 
      day.participations?.some((p: any) => p.userId === user.id)
    );
    return {
      ...user,
      participations: userParticipations.length,
      leadership: filteredPreachingDays.filter((day: any) => day.leaderId === user.id).length
    };
  }).sort((a, b) => b.participations - a.participations);

  const handleExportReport = () => {
    // Export logic would go here
    console.log("Exporting report...");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-600">Análise de atividades e participações</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="mr-2" size={16} />
          Exportar Relatório
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30">Últimos 30 dias</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Território</label>
              <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os territórios</SelectItem>
                  {territories.map((territory: any) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data início</label>
                  <Popover open={showStartPicker} onOpenChange={setShowStartPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "dd/MM/yyyy") : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={(date) => {
                          setCustomStartDate(date);
                          setShowStartPicker(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data fim</label>
                  <Popover open={showEndPicker} onOpenChange={setShowEndPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "dd/MM/yyyy") : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={(date) => {
                          setCustomEndDate(date);
                          setShowEndPicker(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Atividades</p>
                <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
              </div>
              <FileText className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividades Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">{completedActivities}</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Participações</p>
                <p className="text-2xl font-bold text-gray-900">{totalParticipations}</p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
              </div>
              <ChartBar className="text-orange-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Territory Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2" size={20} />
              Desempenho por Território
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territoryStats.map((territory: any) => (
                <div key={territory.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{territory.name}</span>
                      <span className="text-sm text-gray-500">
                        {territory.completed}/{territory.activities}
                      </span>
                    </div>
                    <Progress value={territory.rate} className="h-2" />
                  </div>
                </div>
              ))}
              {territoryStats.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum dado de território disponível para o período selecionado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Participation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" size={20} />
              Participação dos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userStats.slice(0, 10).map((user: any, index: number) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">
                        {user.leadership > 0 && `${user.leadership} lideranças`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {user.participations} participações
                  </Badge>
                </div>
              ))}
              {userStats.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum dado de participação disponível para o período selecionado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}