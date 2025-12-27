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

export interface Team {
  id: string;
  name: string;
  description: string;
  members: Array<{ id: string; name: string; email: string; role: string }>;
  createdAt: string;
}

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamAdded?: (team: Team) => void;
  editTeam?: Team | null;
  onTeamUpdated?: (team: Team) => void;
}

export function AddTeamDialog({ 
  open, 
  onOpenChange,
  onTeamAdded,
  editTeam,
  onTeamUpdated
}: AddTeamDialogProps) {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const isEditMode = !!editTeam;

  // Populate form when editing
  useEffect(() => {
    if (editTeam) {
      setTeamName(editTeam.name);
      setDescription(editTeam.description);
    } else {
      setTeamName('');
      setDescription('');
    }
  }, [editTeam, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && editTeam) {
      // Update existing team
      const updatedTeam: Team = {
        ...editTeam,
        name: teamName.trim(),
        description: description.trim(),
      };
      
      onTeamUpdated?.(updatedTeam);
      
      toast({
        title: "Success",
        description: `Team "${teamName}" has been updated successfully.`,
      });
    } else {
      // Create new team
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamName.trim(),
        description: description.trim(),
        members: [],
        createdAt: new Date().toISOString(),
      };

      onTeamAdded?.(newTeam);
      
      toast({
        title: "Success",
        description: `Team "${teamName}" has been created successfully.`,
      });
    }
    
    setTeamName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Team' : 'Add New Team'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter team description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-4">
            <SmartButton type="submit" icon={isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
              {isEditMode ? 'Save Changes' : 'Add Team'}
            </SmartButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
