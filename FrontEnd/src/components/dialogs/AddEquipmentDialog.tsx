import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Workcenter } from './AddWorkcenterDialog';
import { Team } from './AddTeamDialog';
import { Employee } from './AddEmployeeDialog';
import { Technician } from './AddTechnicianDialog';
import { Category } from '@/pages/Categories';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  workcenterId: string;
  workcenterName: string;
  teamId: string;
  teamName: string;
  usedById: string;
  usedByName: string;
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  status: 'operational' | 'under-maintenance' | 'out-of-order';
  createdAt: string;
}

// Helper functions for localStorage
const WORKCENTERS_STORAGE_KEY = 'gearguard_workcenters';
const TEAMS_STORAGE_KEY = 'gearguard_teams';
const EMPLOYEES_STORAGE_KEY = 'gearguard_employees';
const TECHNICIANS_STORAGE_KEY = 'gearguard_technicians';
const CATEGORIES_STORAGE_KEY = 'gearguard_categories';
const EQUIPMENT_STORAGE_KEY = 'gearguard_equipment';

const getStoredWorkcenters = (): Workcenter[] => {
  try {
    const stored = localStorage.getItem(WORKCENTERS_STORAGE_KEY);
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

const getStoredEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
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

const getStoredCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredEquipment = (): Equipment[] => {
  try {
    const stored = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEquipmentToStorage = (equipment: Equipment[]) => {
  localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(equipment));
};

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentAdded?: (equipment: Equipment) => void;
  editEquipment?: Equipment | null;
  onEquipmentUpdated?: (equipment: Equipment) => void;
}

export function AddEquipmentDialog({ 
  open, 
  onOpenChange,
  onEquipmentAdded,
  editEquipment,
  onEquipmentUpdated
}: AddEquipmentDialogProps) {
  const { toast } = useToast();

  // Data from localStorage
  const [workcenters, setWorkcenters] = useState<Workcenter[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [workcenterId, setWorkcenterId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [usedById, setUsedById] = useState('');
  const [assignedTechnicianId, setAssignedTechnicianId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'operational' | 'under-maintenance' | 'out-of-order'>('operational');

  const isEditMode = !!editEquipment;

  // Load data from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      // First load all available options from localStorage
      const storedWorkcenters = getStoredWorkcenters();
      const storedTeams = getStoredTeams();
      const storedEmployees = getStoredEmployees();
      const storedTechnicians = getStoredTechnicians();
      const storedCategories = getStoredCategories();

      setWorkcenters(storedWorkcenters);
      setTeams(storedTeams);
      setEmployees(storedEmployees);
      setTechnicians(storedTechnicians);
      setCategories(storedCategories);

      // Then set form values (after options are available)
      if (editEquipment) {
        setName(editEquipment.name || '');
        setSerialNumber(editEquipment.serialNumber || '');
        setCategory(editEquipment.category || '');
        setWorkcenterId(editEquipment.workcenterId || '');
        setTeamId(editEquipment.teamId || '');
        setUsedById(editEquipment.usedById || '');
        setAssignedTechnicianId(editEquipment.assignedTechnicianId || '');
        setPurchaseDate(editEquipment.purchaseDate || '');
        setWarrantyExpiry(editEquipment.warrantyExpiry || '');
        setLocation(editEquipment.location || '');
        setStatus(editEquipment.status || 'operational');
      } else {
        setName('');
        setSerialNumber('');
        setCategory('');
        setWorkcenterId('');
        setTeamId('');
        setUsedById('');
        setAssignedTechnicianId('');
        setPurchaseDate('');
        setWarrantyExpiry('');
        setLocation('');
        setStatus('operational');
      }
    }
  }, [open, editEquipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Equipment name is required",
        variant: "destructive",
      });
      return;
    }

    const selectedWorkcenter = workcenters.find(w => w.id === workcenterId);
    const selectedTeam = teams.find(t => t.id === teamId);
    const selectedEmployee = employees.find(e => e.id === usedById);
    const selectedTechnician = technicians.find(t => t.id === assignedTechnicianId);

    if (isEditMode && editEquipment) {
      const updatedEquipment: Equipment = {
        ...editEquipment,
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        category,
        workcenterId,
        workcenterName: selectedWorkcenter?.name || '',
        teamId,
        teamName: selectedTeam?.name || '',
        usedById,
        usedByName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        assignedTechnicianId,
        assignedTechnicianName: selectedTechnician ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}` : '',
        purchaseDate,
        warrantyExpiry,
        location: location.trim(),
        status,
      };

      onEquipmentUpdated?.(updatedEquipment);

      toast({
        title: "Success",
        description: `Equipment "${name}" has been updated.`,
      });
    } else {
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        category,
        workcenterId,
        workcenterName: selectedWorkcenter?.name || '',
        teamId,
        teamName: selectedTeam?.name || '',
        usedById,
        usedByName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        assignedTechnicianId,
        assignedTechnicianName: selectedTechnician ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}` : '',
        purchaseDate,
        warrantyExpiry,
        location: location.trim(),
        status: 'operational', // Default status for new equipment
        createdAt: new Date().toISOString(),
      };

      onEquipmentAdded?.(newEquipment);

      toast({
        title: "Success",
        description: `Equipment "${name}" has been added.`,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditMode ? 'Edit Equipment' : 'Add New Equipment'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., CNC Machine 01"
              required
            />
          </div>

          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g., CNC-2024-001"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>No categories available</SelectItem>
                ) : (
                  categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add categories from Equipment → Manage Categories</p>
            )}
          </div>

          <div>
            <Label>Work Center</Label>
            <Select value={workcenterId} onValueChange={setWorkcenterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select workcenter" />
              </SelectTrigger>
              <SelectContent>
                {workcenters.length === 0 ? (
                  <SelectItem value="" disabled>No workcenters available</SelectItem>
                ) : (
                  workcenters.map(wc => (
                    <SelectItem key={wc.id} value={wc.id}>
                      {wc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {workcenters.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add workcenters from Workcenters page</p>
            )}
          </div>

          <div>
            <Label>Maintenance Team</Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.length === 0 ? (
                  <SelectItem value="" disabled>No teams available</SelectItem>
                ) : (
                  teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {teams.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add teams from Teams page</p>
            )}
          </div>

          <div>
            <Label>Used By (Employee)</Label>
            <Select value={usedById} onValueChange={setUsedById}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.length === 0 ? (
                  <SelectItem value="" disabled>No employees available</SelectItem>
                ) : (
                  employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {employees.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add employees from Users → Employees</p>
            )}
          </div>

          <div>
            <Label>Assigned Technician</Label>
            <Select value={assignedTechnicianId} onValueChange={setAssignedTechnicianId}>
              <SelectTrigger>
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.length === 0 ? (
                  <SelectItem value="" disabled>No technicians available</SelectItem>
                ) : (
                  technicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.firstName} {tech.lastName} {tech.specialization ? `(${tech.specialization})` : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {technicians.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add technicians from Users → Technicians</p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="under-maintenance">Under Maintenance</SelectItem>
                <SelectItem value="out-of-order">Out of Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
            <Input
              id="warrantyExpiry"
              type="date"
              value={warrantyExpiry}
              onChange={(e) => setWarrantyExpiry(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Building A, Floor 1"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Save Changes' : 'Add Equipment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
