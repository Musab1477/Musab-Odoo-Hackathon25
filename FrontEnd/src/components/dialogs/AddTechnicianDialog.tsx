import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Team } from './AddTeamDialog';

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  mobileNo: string;
  email: string;
  address: string;
  teamId: string;
  teamName: string;
  specialization: string;
  experience: string;
  createdAt: string;
}

interface AddTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTechnicianAdded?: (technician: Technician) => void;
  editTechnician?: Technician | null;
  onTechnicianUpdated?: (technician: Technician) => void;
  teams: Team[];
}

const SPECIALIZATIONS = [
  'Mechanical',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Electronics',
  'Welding',
  'Carpentry',
  'General Maintenance',
  'Industrial Equipment',
  'Automation',
];

export function AddTechnicianDialog({ 
  open, 
  onOpenChange,
  onTechnicianAdded,
  editTechnician,
  onTechnicianUpdated,
  teams
}: AddTechnicianDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    mobileNo: '',
    email: '',
    address: '',
    teamId: '',
    specialization: '',
    experience: '',
  });

  const isEditMode = !!editTechnician;

  // Populate form when editing
  useEffect(() => {
    if (editTechnician) {
      setFormData({
        firstName: editTechnician.firstName,
        lastName: editTechnician.lastName,
        age: editTechnician.age,
        mobileNo: editTechnician.mobileNo,
        email: editTechnician.email,
        address: editTechnician.address,
        teamId: editTechnician.teamId,
        specialization: editTechnician.specialization,
        experience: editTechnician.experience,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        mobileNo: '',
        email: '',
        address: '',
        teamId: '',
        specialization: '',
        experience: '',
      });
    }
  }, [editTechnician, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.teamId) {
      toast({
        title: "Error",
        description: "Please select a team",
        variant: "destructive",
      });
      return;
    }

    // Mobile number validation (10 digits)
    if (formData.mobileNo.trim() && !/^\d{10}$/.test(formData.mobileNo.trim())) {
      toast({
        title: "Error",
        description: "Mobile number must be exactly 10 digits",
        variant: "destructive",
      });
      return;
    }

    const selectedTeam = teams.find(t => t.id === formData.teamId);
    const teamName = selectedTeam?.name || '';

    if (isEditMode && editTechnician) {
      const updatedTechnician: Technician = {
        ...editTechnician,
        ...formData,
        teamName,
      };
      
      onTechnicianUpdated?.(updatedTechnician);
      
      toast({
        title: "Success",
        description: `Technician "${formData.firstName} ${formData.lastName}" has been updated.`,
      });
    } else {
      const newTechnician: Technician = {
        id: `tech-${Date.now()}`,
        ...formData,
        teamName,
        createdAt: new Date().toISOString(),
      };

      onTechnicianAdded?.(newTechnician);
      
      toast({
        title: "Success",
        description: `Technician "${formData.firstName} ${formData.lastName}" has been added.`,
      });
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      mobileNo: '',
      email: '',
      address: '',
      teamId: '',
      specialization: '',
      experience: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Technician' : 'Add New Technician'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Personal Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input
                  id="mobileNo"
                  name="mobileNo"
                  placeholder="Enter mobile number"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Work Information</h4>
            
            <div className="space-y-2">
              <Label htmlFor="teamId">Team *</Label>
              <Select value={formData.teamId} onValueChange={(value) => handleSelectChange('teamId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.length === 0 ? (
                    <SelectItem value="" disabled>No teams available</SelectItem>
                  ) : (
                    teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {teams.length === 0 && (
                <p className="text-xs text-destructive">Please create a team first in the Teams page</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select value={formData.specialization} onValueChange={(value) => handleSelectChange('specialization', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                placeholder="Enter years of experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <SmartButton type="submit" icon={isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
              {isEditMode ? 'Save Changes' : 'Add Technician'}
            </SmartButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
