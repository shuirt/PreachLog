import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Church } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotificationPanel from "@/components/notifications/notification-panel";

export default function Header() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'ADMIN',
      COORDINATOR: 'COORD',
      LEADER: 'LÍDER',
      MEMBER: 'MEMBRO'
    };
    return roles[role] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <Church className="text-white" size={16} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Sistema de Pregação</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-gray-400 hover:text-gray-600 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center p-0"
              >
                3
              </Badge>
            </Button>
            
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImageUrl || ""} />
              <AvatarFallback className="text-xs">{getInitials(user?.name || "")}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{getRoleLabel(user?.role || "")}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
