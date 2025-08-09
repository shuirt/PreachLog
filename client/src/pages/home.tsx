import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, MapPin, Users, Map, ChartBar, CheckCircle, UserPlus, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";
import { useState } from "react";
import DayDetailsModal from "@/components/modals/day-details-modal";

export default function Home() {
  const { user } = useAuth();
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  // Get today's preaching day
  const { data: todayActivity } = useQuery({
    queryKey: ["/api/preaching-days/today"],
  });

  // Get territories for progress overview
  const { data: territories = [] } = useQuery({
    queryKey: ["/api/territories"],
  });

  const handleOpenDayDetails = () => {
    if (todayActivity) {
      setSelectedDay(todayActivity);
      setShowDayDetails(true);
    }
  };

  const handleConfirmParticipation = () => {
    // Logic to confirm participation
    console.log("Confirming participation");
  };

  const today = new Date();
  const dateStr = format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Calculate progress stats
  const totalTerritories = territories.length;
  const completedTerritories = territories.filter((t: any) => t.completionRate === 100).length;
  const territoryProgress = totalTerritories > 0 ? (completedTerritories / totalTerritories) * 100 : 0;

  return (
    <div>
      {/* Today's Date */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 capitalize">{dateStr}</h2>
      </div>
      
      {/* Today's Activity Card */}
      {todayActivity ? (
        <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleOpenDayDetails}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={20} />
                  Atividade de Hoje
                </h3>
              </div>
              <Badge 
                variant={todayActivity.status === 'CONFIRMED' ? 'default' : 'secondary'}
                className={todayActivity.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
              >
                {todayActivity.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Horário de Saída</p>
                  <p className="font-medium">{todayActivity.departureTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Local de Saída</p>
                  <p className="font-medium">{todayActivity.meetingPlace}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Dirigente</p>
                  <p className="font-medium">Dirigente do Dia</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">Participantes confirmados</span>
                  </div>
                  {todayActivity.territoryId && (
                    <div className="flex items-center space-x-2">
                      <Map className="text-gray-400" size={14} />
                      <span className="text-sm text-gray-600">Território designado</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                  Ver detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma Atividade Hoje</h3>
            <p className="text-gray-600">Não há atividades de pregação programadas para hoje.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary-300 hover:shadow-md"
          onClick={handleConfirmParticipation}
          disabled={!todayActivity}
        >
          <CheckCircle className="text-green-500" size={24} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Confirmar</p>
            <p className="text-xs text-gray-600">Presença</p>
          </div>
        </Button>
        
        <Link href="/calendar">
          <Button
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary-300 hover:shadow-md w-full"
          >
            <Calendar className="text-blue-500" size={24} />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Calendário</p>
              <p className="text-xs text-gray-600">Próximas</p>
            </div>
          </Button>
        </Link>
        
        <Link href="/territories">
          <Button
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary-300 hover:shadow-md w-full"
          >
            <Map className="text-purple-500" size={24} />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Territórios</p>
              <p className="text-xs text-gray-600">Progresso</p>
            </div>
          </Button>
        </Link>
        
        <Link href="/reports">
          <Button
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary-300 hover:shadow-md w-full"
          >
            <ChartBar className="text-orange-500" size={24} />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Relatórios</p>
              <p className="text-xs text-gray-600">Estatísticas</p>
            </div>
          </Button>
        </Link>
      </div>
      
      {/* Recent Activity & Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Sistema iniciado com sucesso
                  </p>
                  <p className="text-xs text-gray-500">Agora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Overview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso Geral</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Territórios Concluídos</span>
                  <span className="font-medium">{completedTerritories}/{totalTerritories}</span>
                </div>
                <Progress value={territoryProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Participação Este Mês</span>
                  <span className="font-medium">-</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Atividades Realizadas</span>
                  <span className="font-medium">-</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Details Modal */}
      {showDayDetails && selectedDay && (
        <DayDetailsModal 
          day={selectedDay}
          isOpen={showDayDetails}
          onClose={() => setShowDayDetails(false)}
        />
      )}
    </div>
  );
}
