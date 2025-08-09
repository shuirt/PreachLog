import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NewActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewActivityModal({ open, onOpenChange }: NewActivityModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    territoryId: "",
    date: new Date(),
    departureTime: "",
    meetingPlace: "",
    maxParticipants: 10,
    notes: "",
    status: "SCHEDULED"
  });

  // Get territories for selection
  const { data: territories = [] } = useQuery({
    queryKey: ["/api/territories"],
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/preaching-days", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Atividade criada",
        description: "A nova atividade foi criada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/preaching-days"] });
      onOpenChange(false);
      setFormData({
        territoryId: "",
        date: new Date(),
        departureTime: "",
        meetingPlace: "",
        maxParticipants: 10,
        notes: "",
        status: "SCHEDULED"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a atividade. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActivityMutation.mutate({
      ...formData,
      date: selectedDate.toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Atividade de Pregação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setShowDatePicker(false);
                      }
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="departureTime">Horário de Saída</Label>
              <Input
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="meetingPlace">Local de Saída</Label>
            <Input
              id="meetingPlace"
              value={formData.meetingPlace}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingPlace: e.target.value }))}
              placeholder="Ex: Salão do Reino"
              required
            />
          </div>

          <div>
            <Label htmlFor="territory">Território</Label>
            <Select 
              value={formData.territoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, territoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um território" />
              </SelectTrigger>
              <SelectContent>
                {territories.map((territory: any) => (
                  <SelectItem key={territory.id} value={territory.id}>
                    {territory.name} - {territory.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Agendado</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createActivityMutation.isPending}>
              {createActivityMutation.isPending ? "Criando..." : "Criar Atividade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}