import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipment, maintenanceTeams, teamMembers } from '@/data/mockData';
import { RequestType, Priority } from '@/types';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEquipmentId?: string;
  defaultDate?: string;
  defaultType?: RequestType;
}

export function NewRequestDialog({ 
  open, 
  onOpenChange, 
  defaultEquipmentId = '',
  defaultDate,
  defaultType = 'Corrective'
}: NewRequestDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequestType>(defaultType);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [equipmentId, setEquipmentId] = useState(defaultEquipmentId);
  const [teamId, setTeamId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    defaultDate || new Date().toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSubject('');
      setDescription('');
      setType(defaultType);
      setPriority('Medium');
      setEquipmentId(defaultEquipmentId);
      setTeamId('');
      setTechnicianId('');
      setScheduledDate(defaultDate || new Date().toISOString().split('T')[0]);
      setDuration('');
    }
  }, [open, defaultEquipmentId, defaultDate, defaultType]);

  // Auto-fill logic: when equipment is selected, fill team and technician
  useEffect(() => {
    if (equipmentId) {
      const selectedEquipment = equipment.find(e => e.id === equipmentId);
      if (selectedEquipment) {
        setTeamId(selectedEquipment.maintenanceTeam.id);
        if (selectedEquipment.defaultTechnician) {
          setTechnicianId(selectedEquipment.defaultTechnician.id);
        }
      }
    }
  }, [equipmentId]);

  const teamTechnicians = teamMembers.filter(m => m.teamId === teamId && m.role === 'Technician');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Request Created",
      description: `Maintenance request "${subject}" has been created successfully.`,
    });
    
    onOpenChange(false);
    navigate('/requests');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Maintenance Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is wrong? (e.g., Leaking Oil)"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details about the issue..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Request Type *</Label>
                <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
                    <SelectItem value="Preventive">Preventive (Routine Checkup)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority *</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Equipment & Team */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Equipment & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Equipment *</Label>
                <Select value={equipmentId} onValueChange={setEquipmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} ({eq.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecting equipment will auto-fill the maintenance team
                </p>
              </div>
              <div>
                <Label>Maintenance Team</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assign Technician</Label>
                <Select 
                  value={technicianId} 
                  onValueChange={setTechnicianId}
                  disabled={!teamId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {teamTechnicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
                {type === 'Preventive' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    This request will appear on the calendar view
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="duration">Estimated Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 2"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
