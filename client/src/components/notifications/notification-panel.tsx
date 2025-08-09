import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { user } = useAuth();

  // Get notifications for current user
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'WARNING':
        return <AlertTriangle className="text-yellow-600" size={16} />;
      case 'ERROR':
        return <XCircle className="text-red-600" size={16} />;
      case 'REMINDER':
        return <Clock className="text-blue-600" size={16} />;
      default:
        return <Info className="text-blue-600" size={16} />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      case 'REMINDER':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    // TODO: Implement mark all as read functionality
  };

  return (
    <Card className="absolute top-12 right-0 w-80 shadow-lg border z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Bell className="mr-2" size={16} />
            Notificações
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary-600 hover:text-primary-700 p-1"
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação nova.</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification: any) => (
              <div 
                key={notification.id} 
                className={`p-3 border rounded-lg ${getNotificationBg(notification.type)}`}
              >
                <div className="flex items-start space-x-2">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 10 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
              Ver todas ({notifications.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
