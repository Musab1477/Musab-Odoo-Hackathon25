import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { equipment } from '@/data/mockData';
import { RequestType } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
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

export default function RequestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [subject, setSubject] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [type, setType] = useState<RequestType>('Corrective');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationHours, setDurationHours] = useState('');
  const [notes, setNotes] = useState('');
  const [instruction, setInstruction] = useState('');

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

    // Simulate form submission
    toast({
      title: "Request Created",
      description: `Maintenance request "${subject}" has been created successfully.`,
    });
    
    navigate('/requests');
  };

  return (
    <MainLayout>
      <div className="animate-fade-in max-w-3xl">
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
          <h1 className="page-title font-display">New Maintenance Request</h1>
          <p className="text-muted-foreground mt-1">Create a new maintenance request for equipment</p>
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
                    {equipment.map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} ({eq.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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

              {/* Conditional fields for Preventive type */}
              {type === 'Preventive' && (
                <div className="grid grid-cols-2 gap-4">
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
              Add Request
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
