import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Users, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MonthManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMonth: Date;
}

export default function MonthManagementModal({ open, onOpenChange, selectedMonth }: MonthManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  // Get preaching days for the month
  const { data: preachingDays = [] } = useQuery({
    queryKey: ["/api/preaching-days", { 
      startDate: monthStart.toISOString(), 
      endDate: monthEnd.toISOString() 
    }],
    enabled: open,
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      return apiRequest(`/api/preaching-days/${activityId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Atividade excluída",
        description: "A atividade foi excluída com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/preaching-days"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a atividade.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteActivity = (activityId: string) => {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      CONFIRMED: 'Confirmado',
      SCHEDULED: 'Agendado',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2" size={20} />
            Gerenciar Mês - {format(selectedMonth, "MMMM yyyy", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{preachingDays.length}</p>
              <p className="text-sm text-gray-600">Total de Atividades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {preachingDays.filter((day: any) => day.status === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-600">Concluídas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {preachingDays.filter((day: any) => day.status === 'SCHEDULED' || day.status === 'CONFIRMED').length}
              </p>
              <p className="text-sm text-gray-600">Agendadas</p>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {preachingDays.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma Atividade Programada
                  </h3>
                  <p className="text-gray-600">
                    Não há atividades programadas para este mês.
                  </p>
                </CardContent>
              </Card>
            ) : (
              preachingDays
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((activity: any) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {format(new Date(activity.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {getStatusLabel(activity.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock size={14} />
                              <span>{activity.departureTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users size={14} />
                              <span>{activity.participations?.length || 0} participantes</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            Local: {activity.meetingPlace}
                          </p>
                          
                          {activity.notes && (
                            <p className="text-sm text-gray-500 mt-2 italic">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id)}
                            disabled={deleteActivityMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Plus className="mr-2" size={16} />
                Nova Atividade
              </Button>
              <Button>
                Gerar Relatório do Mês
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}