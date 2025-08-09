import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Settings as SettingsIcon, Users, ServerCog, FileText, History, Key, Download, LogOut, Upload, Crown, UserCheck, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import UserManagementModal from "@/components/modals/user-management-modal";

export default function Settings() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSystemConfig, setShowSystemConfig] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  // Get user participations for history
  const { data: participations = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "participations"],
    enabled: !!user?.id,
  });

  const handleProfileSave = () => {
    console.log("Saving profile:", profileData);
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      window.location.href = '/api/logout';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      COORDINATOR: 'Coordenador',
      LEADER: 'Dirigente',
      MEMBER: 'Membro'
    };
    return roles[role] || role;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'leader':
        return <Crown className="text-green-600" size={14} />;
      case 'participant':
        return <UserCheck className="text-blue-600" size={14} />;
      case 'territory':
        return <MapPin className="text-purple-600" size={14} />;
      default:
        return <SettingsIcon className="text-gray-600" size={14} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-600">Gerencie suas preferências e conta</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil do Usuário</h3>
              
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2" size={16} />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-gray-600 mt-1">JPG ou PNG. Máximo 2MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                  <Input 
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">Função</Label>
                  <Input 
                    id="role"
                    value={getRoleLabel(user?.role || "")}
                    disabled
                    className="mt-1 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button onClick={handleProfileSave}>
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity History */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Atividades</h3>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                  Exportar
                </Button>
              </div>
              
              <div className="space-y-4">
                {participations.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Nenhuma atividade registrada ainda.</p>
                  </div>
                ) : (
                  participations.slice(0, 5).map((participation: any) => (
                    <div key={participation.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {getActivityIcon('participant')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          Participou de atividade de pregação
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(participation.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {participation.notes && (
                          <div className="text-xs text-gray-600 mt-1">
                            {participation.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Lembretes de Atividades</p>
                    <p className="text-xs text-gray-600">30 min antes do início</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Novas Atividades</p>
                    <p className="text-xs text-gray-600">Quando criadas pelo admin</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Atualizações</p>
                    <p className="text-xs text-gray-600">Mudanças em atividades</p>
                  </div>
                  <Checkbox />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Tools */}
          {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ferramentas de Admin</h3>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Users className="mr-2 text-gray-600" size={16} />
                    Gerenciar Usuários
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <ServerCog className="mr-2 text-gray-600" size={16} />
                    Configurações do Sistema
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 text-gray-600" size={16} />
                    Relatórios Avançados
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <History className="mr-2 text-gray-600" size={16} />
                    Logs de Atividade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Account Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conta</h3>
              
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Key className="mr-2 text-gray-600" size={16} />
                  Alterar Senha
                </Button>
                
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Download className="mr-2 text-gray-600" size={16} />
                  Baixar Meus Dados
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2" size={16} />
                  Sair da Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <UserManagementModal
        open={showUserManagement}
        onOpenChange={setShowUserManagement}
      />
    </div>
  );
}
