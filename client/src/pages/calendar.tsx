import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import DayDetailsModal from "@/components/modals/day-details-modal";
import NewActivityModal from "@/components/modals/new-activity-modal";
import MonthManagementModal from "@/components/modals/month-management-modal";

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [showMonthManagement, setShowMonthManagement] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get preaching days for current month
  const { data: preachingDays = [] } = useQuery({
    queryKey: ["/api/preaching-days", monthStart.toISOString(), monthEnd.toISOString()],
  });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    const dayActivity = preachingDays.find((pd: any) => 
      isSameDay(new Date(pd.date), day)
    );
    
    if (dayActivity) {
      setSelectedDay(dayActivity);
      setShowDayDetails(true);
    }
  };

  const getDayActivity = (day: Date) => {
    return preachingDays.find((pd: any) => 
      isSameDay(new Date(pd.date), day)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-purple-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Generate calendar days
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
  
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNextMonth}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {user?.role === 'ADMIN' && (
                <Button variant="outline" size="sm" onClick={() => setShowMonthManagement(true)}>
                  <Settings className="mr-1" size={16} />
                  Gerenciar Mês
                </Button>
              )}
              <Button size="sm" onClick={() => setShowNewActivity(true)}>
                <Plus className="mr-1" size={16} />
                Nova Atividade
              </Button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const dayActivity = getDayActivity(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    p-3 text-center cursor-pointer rounded transition-colors
                    ${!isCurrentMonth ? 'text-gray-400' : 'hover:bg-gray-50'}
                    ${isDayToday ? 'bg-primary-100 border border-primary-300 text-primary-700 font-semibold' : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                  {dayActivity && isCurrentMonth && (
                    <div className="mt-1">
                      <div className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(dayActivity.status)}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">Confirmado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-600">Agendado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-gray-600">Em Progresso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm text-gray-600">Concluído</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                Gerenciar Mês
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showDayDetails && selectedDay && (
        <DayDetailsModal 
          day={selectedDay}
          isOpen={showDayDetails}
          onClose={() => setShowDayDetails(false)}
        />
      )}

      <NewActivityModal
        open={showNewActivity}
        onOpenChange={setShowNewActivity}
      />

      <MonthManagementModal
        open={showMonthManagement}
        onOpenChange={setShowMonthManagement}
        selectedMonth={currentDate}
      />
    </div>
  );
}
