import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DayDetailsModalProps {
  day: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DayDetailsModal({ day, isOpen, onClose }: DayDetailsModalProps) {
  // Get participations for this day
  const { data: participations = [] } = useQuery({
    queryKey: ["/api/preaching-days", day?.id, "participations"],
    enabled: !!day?.id && isOpen,
  });

  if (!day) return null;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>Detalhes da Atividade</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Day Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data:</span>
                <span className="font-medium block">
                  {format(new Date(day.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Horário:</span>
                <span className="font-medium block">{day.departureTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Local:</span>
                <span className="font-medium block">{day.meetingPlace}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge className={`mt-1 ${getStatusColor(day.status)}`}>
                  {day.status}
                </Badge>
              </div>
            </div>
            
            {day.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-600 text-sm">Observações:</span>
                <p className="text-sm text-gray-900 mt-1">{day.notes}</p>
              </div>
            )}
          </div>
          
          {/* Participants List */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Participantes ({participations.length})
            </h4>
            
            {participations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum participante confirmado ainda.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {participations.map((participation: any) => (
                  <div key={participation.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {getInitials("Participante")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Participante</span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={participation.attendedAt ? "text-green-600 border-green-300" : "text-gray-600"}
                    >
                      {participation.attendedAt ? "CONFIRMADO" : "PENDENTE"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                Confirmar Presença
              </Button>
              <Button variant="outline" className="flex-1">
                Não Posso Ir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
