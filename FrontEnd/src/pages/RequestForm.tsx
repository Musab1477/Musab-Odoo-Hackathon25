import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { RequestType } from '@/types';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Equipment } from '@/components/dialogs/AddEquipmentDialog';
import { Team } from '@/components/dialogs/AddTeamDialog';
import { Technician } from '@/components/dialogs/AddTechnicianDialog';

// localStorage keys
const EQUIPMENT_STORAGE_KEY = 'gearguard_equipment';
const TEAMS_STORAGE_KEY = 'gearguard_teams';
const TECHNICIANS_STORAGE_KEY = 'gearguard_technicians';
const REQUESTS_STORAGE_KEY = 'gearguard_requests';

// Request interface
export interface MaintenanceRequestData {
  id: string;
  subject: string;
  equipmentId: string;
  equipmentName: string;
  type: RequestType;
  priority: 'Low' | 'Medium' | 'High';
  status: 'New' | 'In Progress' | 'Repaired' | 'Scrap';
  teamId: string;
  teamName: string;
  teamMembers: { id: string; name: string }[];
  scheduledDate?: string;
  durationHours?: string;
  notes: string;
  instruction: string;
  createdAt: string;
}

const getStoredEquipment = (): Equipment[] => {
  try {
    const stored = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredTeams = (): Team[] => {
  try {
    const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredTechnicians = (): Technician[] => {
  try {
    const stored = localStorage.getItem(TECHNICIANS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredRequests = (): MaintenanceRequestData[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRequestsToStorage = (requests: MaintenanceRequestData[]) => {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
};

export default function RequestForm() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = Boolean(editId);

  // Data from localStorage
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  // Selected equipment's team info
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<Technician[]>([]);

  // Form state
  const [subject, setSubject] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [type, setType] = useState<RequestType>('Corrective');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [status, setStatus] = useState<'New' | 'In Progress' | 'Repaired' | 'Scrap'>('New');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationHours, setDurationHours] = useState('');
  const [notes, setNotes] = useState('');
  const [instruction, setInstruction] = useState('');
  const [originalCreatedAt, setOriginalCreatedAt] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const equipment = getStoredEquipment();
    const teamsData = getStoredTeams();
    const techniciansData = getStoredTechnicians();
    
    setEquipmentList(equipment);
    setTeams(teamsData);
    setTechnicians(techniciansData);

    // Load request data in edit mode AFTER equipment/teams are loaded
    if (isEditMode && editId) {
      const requests = getStoredRequests();
      const requestToEdit = requests.find(r => r.id === editId);
      if (requestToEdit) {
        setSubject(requestToEdit.subject);
        setEquipmentId(requestToEdit.equipmentId);
        setType(requestToEdit.type);
        setPriority(requestToEdit.priority);
        setStatus(requestToEdit.status);
        setScheduledDate(requestToEdit.scheduledDate || new Date().toISOString().split('T')[0]);
        setDurationHours(requestToEdit.durationHours || '');
        setNotes(requestToEdit.notes);
        setInstruction(requestToEdit.instruction);
        setOriginalCreatedAt(requestToEdit.createdAt);

        // Auto-fill team info for edit mode
        if (requestToEdit.equipmentId) {
          const selectedEquipment = equipment.find(eq => eq.id === requestToEdit.equipmentId);
          if (selectedEquipment && selectedEquipment.teamId) {
            const team = teamsData.find(t => t.id === selectedEquipment.teamId);
            if (team) {
              setSelectedTeam(team);
              const members = techniciansData.filter(t => t.teamId === team.id);
              setTeamMembers(members);
            }
          }
        }
      }
    }
  }, [isEditMode, editId]);

  // When equipment is selected, auto-fill team info
  useEffect(() => {
    if (equipmentId) {
      const selectedEquipment = equipmentList.find(eq => eq.id === equipmentId);
      if (selectedEquipment && selectedEquipment.teamId) {
        const team = teams.find(t => t.id === selectedEquipment.teamId);
        if (team) {
          setSelectedTeam(team);
          // Get technicians for this team
          const members = technicians.filter(t => t.teamId === team.id);
          setTeamMembers(members);
        } else {
          setSelectedTeam(null);
          setTeamMembers([]);
        }
      } else {
        setSelectedTeam(null);
        setTeamMembers([]);
      }
    } else {
      setSelectedTeam(null);
      setTeamMembers([]);
    }
  }, [equipmentId, equipmentList, teams, technicians]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !equipmentId) {
      toast({
        title: "Error",
        description: "Subject and Equipment are required",
        variant: "destructive",
      });
      return;
    }

    const selectedEquipment = equipmentList.find(eq => eq.id === equipmentId);

    const requestData: MaintenanceRequestData = {
      id: isEditMode && editId ? editId : `req-${Date.now()}`,
      subject: subject.trim(),
      equipmentId,
      equipmentName: selectedEquipment?.name || '',
      type,
      priority,
      status: isEditMode ? status : 'New', // Keep status in edit mode, New for new requests
      teamId: selectedTeam?.id || '',
      teamName: selectedTeam?.name || '',
      teamMembers: teamMembers.map(m => ({ id: m.id, name: `${m.firstName} ${m.lastName}` })),
      scheduledDate: type === 'Preventive' ? scheduledDate : undefined,
      durationHours: type === 'Preventive' ? durationHours : undefined,
      notes: notes.trim(),
      instruction: instruction.trim(),
      createdAt: isEditMode ? originalCreatedAt : new Date().toISOString(),
    };

    // Save to localStorage
    const existingRequests = getStoredRequests();
    
    if (isEditMode) {
      // Update existing request
      const updatedRequests = existingRequests.map(r => 
        r.id === editId ? requestData : r
      );
      saveRequestsToStorage(updatedRequests);
      toast({
        title: "Request Updated",
        description: `Maintenance request "${subject}" has been updated successfully.`,
      });
    } else {
      // Add new request
      saveRequestsToStorage([...existingRequests, requestData]);
      toast({
        title: "Request Created",
        description: `Maintenance request "${subject}" has been created successfully.`,
      });
    }
    
    navigate('/requests');
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/requests')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title font-display">{isEditMode ? 'Edit Maintenance Request' : 'New Maintenance Request'}</h1>
          <p className="text-muted-foreground mt-1">{isEditMode ? 'Update the maintenance request details' : 'Create a new maintenance request for equipment'}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="form-section">
            <h3 className="font-semibold mb-4">Request Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is wrong? (e.g., Leaking Oil)"
                  required
                />
              </div>
              
              <div>
                <Label>Equipment *</Label>
                <Select value={equipmentId} onValueChange={setEquipmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentList.length === 0 ? (
                      <SelectItem value="" disabled>No equipment available</SelectItem>
                    ) : (
                      equipmentList.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} {eq.serialNumber ? `(${eq.serialNumber})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {equipmentList.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Add equipment from Equipment page first</p>
                )}
              </div>

              {/* Show Team Info when equipment is selected */}
              {selectedTeam && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">Assigned Team: {selectedTeam.name}</span>
                  </div>
                  {teamMembers.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Team Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {teamMembers.map(member => (
                          <div key={member.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border text-sm">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {member.firstName[0]}{member.lastName[0]}
                              </span>
                            </div>
                            <span>{member.firstName} {member.lastName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No technicians in this team</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Request Type *</Label>
                  <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority *</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as 'Low' | 'Medium' | 'High')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status dropdown - only shown in edit mode */}
              {isEditMode && (
                <div>
                  <Label>Status *</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as 'New' | 'In Progress' | 'Repaired' | 'Scrap')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Repaired">Repaired</SelectItem>
                      <SelectItem value="Scrap">Scrap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Conditional fields for Preventive type */}
              {type === 'Preventive' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Schedule Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="durationHours">Duration (Hours)</Label>
                    <Input
                      id="durationHours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes & Instructions */}
          <div className="form-section">
            <h3 className="font-semibold mb-4">Notes & Instructions</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this request..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="instruction">Instruction</Label>
                <Textarea
                  id="instruction"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Add instructions for the technician..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/requests')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update Request' : 'Add Request'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
