import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Edit, Trash2, Plus, Crown, UserCheck, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserManagementModal({ open, onOpenChange }: UserManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Get all users
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    enabled: open,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      return apiRequest(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEditingUser(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserMutation.mutate({
      userId,
      updates: { role: newRole }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="text-purple-600" size={16} />;
      case 'COORDINATOR':
        return <UserCheck className="text-blue-600" size={16} />;
      case 'LEADER':
        return <Users className="text-green-600" size={16} />;
      case 'MEMBER':
        return <UserIcon className="text-gray-600" size={16} />;
      default:
        return <UserIcon className="text-gray-600" size={16} />;
    }
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'COORDINATOR':
        return 'bg-blue-100 text-blue-800';
      case 'LEADER':
        return 'bg-green-100 text-green-800';
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2" size={20} />
            Gerenciar Usuários
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {users.filter((user: any) => user.role === 'ADMIN').length}
              </p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {users.filter((user: any) => user.role === 'LEADER').length}
              </p>
              <p className="text-sm text-gray-600">Dirigentes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {users.filter((user: any) => user.role === 'MEMBER').length}
              </p>
              <p className="text-sm text-gray-600">Membros</p>
            </div>
          </div>

          {/* Add User Button */}
          <div className="flex justify-end">
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="mr-2" size={16} />
              Adicionar Usuário
            </Button>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {users.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum Usuário Encontrado
                  </h3>
                  <p className="text-gray-600">
                    Ainda não há usuários cadastrados no sistema.
                  </p>
                </CardContent>
              </Card>
            ) : (
              users.map((user: any) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profileImageUrl || ""} />
                          <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <span>{user.firstName} {user.lastName}</span>
                            {getRoleIcon(user.role)}
                          </h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        
                        <Select 
                          value={user.role} 
                          onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="COORDINATOR">Coordenador</SelectItem>
                            <SelectItem value="LEADER">Dirigente</SelectItem>
                            <SelectItem value="MEMBER">Membro</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
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
                Exportar Lista
              </Button>
              <Button>
                Gerar Relatório de Usuários
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}