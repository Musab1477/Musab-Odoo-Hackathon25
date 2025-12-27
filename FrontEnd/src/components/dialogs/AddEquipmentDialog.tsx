import { useState, useEffect } from 'react';
import { maintenanceTeams, workcenters, equipmentCategories } from '@/data/mockData';
import { EquipmentCategory } from '@/types';
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

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEquipmentDialog({ open, onOpenChange }: AddEquipmentDialogProps) {
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState<EquipmentCategory | ''>('');
  const [workcenterId, setWorkcenterId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [usedBy, setUsedBy] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [location, setLocation] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName('');
      setSerialNumber('');
      setCategory('');
      setWorkcenterId('');
      setTeamId('');
      setUsedBy('');
      setPurchaseDate('');
      setWarrantyExpiry('');
      setLocation('');
    }
  }, [open]);

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

    toast({
      title: "Equipment Added",
      description: `${name} has been added successfully.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Equipment</DialogTitle>
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
            <Select value={category} onValueChange={(v) => setCategory(v as EquipmentCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {equipmentCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Work Center</Label>
            <Select value={workcenterId} onValueChange={setWorkcenterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select workcenter" />
              </SelectTrigger>
              <SelectContent>
                {workcenters.map(wc => (
                  <SelectItem key={wc.id} value={wc.id}>
                    {wc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="usedBy">Used By (Employee Name)</Label>
            <Input
              id="usedBy"
              value={usedBy}
              onChange={(e) => setUsedBy(e.target.value)}
              placeholder="e.g., John Doe"
            />
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
              Add Equipment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
