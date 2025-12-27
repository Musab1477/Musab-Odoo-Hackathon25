import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTeamDialog({ open, onOpenChange }: AddTeamDialogProps) {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState('');

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

    const membersList = members.split(',').map(m => m.trim()).filter(m => m);
    
    toast({
      title: "Success",
      description: `Team "${teamName}" has been created with ${membersList.length} member(s).`,
    });
    
    setTeamName('');
    setMembers('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
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
            <Label htmlFor="members">Team Members</Label>
            <Input
              id="members"
              placeholder="Enter member names (comma separated)"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Add multiple members by separating names with commas (e.g., John Doe, Jane Smith)
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <SmartButton type="submit" icon={<Plus className="w-4 h-4" />}>
              Add Team
            </SmartButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
