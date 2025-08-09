import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NewTerritoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewTerritoryModal({ open, onOpenChange }: NewTerritoryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    mapImageUrl: ""
  });

  const createTerritoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/territories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Território criado",
        description: "O novo território foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/territories"] });
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        location: "",
        mapImageUrl: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o território. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTerritoryMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Território</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Território</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Território Centro"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Ex: Região central da cidade"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Centro, São Paulo"
              required
            />
          </div>

          <div>
            <Label htmlFor="mapImageUrl">URL da Imagem do Mapa (opcional)</Label>
            <Input
              id="mapImageUrl"
              type="url"
              value={formData.mapImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, mapImageUrl: e.target.value }))}
              placeholder="https://exemplo.com/mapa.jpg"
            />
            <p className="text-xs text-gray-600 mt-1">
              Adicione uma imagem do mapa para facilitar a visualização
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createTerritoryMutation.isPending}>
              {createTerritoryMutation.isPending ? "Criando..." : "Criar Território"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}