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

export interface Workcenter {
  id: string;
  name: string;
  description: string;
  location: string;
  department: string;
  createdAt: string;
}

interface AddWorkcenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkcenterAdded?: (workcenter: Workcenter) => void;
  editWorkcenter?: Workcenter | null;
  onWorkcenterUpdated?: (workcenter: Workcenter) => void;
}

export function AddWorkcenterDialog({ 
  open, 
  onOpenChange, 
  onWorkcenterAdded,
  editWorkcenter,
  onWorkcenterUpdated
}: AddWorkcenterDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');

  const isEditMode = !!editWorkcenter;

  // Populate form when editing
  useEffect(() => {
    if (editWorkcenter) {
      setName(editWorkcenter.name);
      setDescription(editWorkcenter.description);
      setLocation(editWorkcenter.location);
      setDepartment(editWorkcenter.department);
    } else {
      setName('');
      setDescription('');
      setLocation('');
      setDepartment('');
    }
  }, [editWorkcenter, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Workcenter name is required",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && editWorkcenter) {
      // Update existing workcenter
      const updatedWorkcenter: Workcenter = {
        ...editWorkcenter,
        name: name.trim(),
        description: description.trim(),
        location: location.trim() || 'Not specified',
        department: department.trim() || 'General',
      };
      
      onWorkcenterUpdated?.(updatedWorkcenter);
      
      toast({
        title: "Success",
        description: `Workcenter "${name}" has been updated successfully.`,
      });
    } else {
      // Create new workcenter
      const newWorkcenter: Workcenter = {
        id: `wc-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        location: location.trim() || 'Not specified',
        department: department.trim() || 'General',
        createdAt: new Date().toISOString(),
      };

      onWorkcenterAdded?.(newWorkcenter);
      
      toast({
        title: "Success",
        description: `Workcenter "${name}" has been added successfully.`,
      });
    }
    
    setName('');
    setDescription('');
    setLocation('');
    setDepartment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Workcenter' : 'Add New Workcenter'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workcenter Name *</Label>
            <Input
              id="name"
              placeholder="Enter workcenter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Textarea
              id="description"
              placeholder="Enter workcenter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-4">
            <SmartButton type="submit" icon={isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
              {isEditMode ? 'Save Changes' : 'Add Workcenter'}
            </SmartButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
