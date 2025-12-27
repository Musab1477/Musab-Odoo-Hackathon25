import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, HardHat, Pencil, Trash2, Mail, Phone, MapPin, Briefcase, Award, Calendar } from 'lucide-react';
import { AddTechnicianDialog, Technician } from '@/components/dialogs/AddTechnicianDialog';
import { Team } from '@/components/dialogs/AddTeamDialog';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper functions for localStorage
const TECHNICIANS_STORAGE_KEY = 'gearguard_technicians';
const TEAMS_STORAGE_KEY = 'gearguard_teams';

const getStoredTechnicians = (): Technician[] => {
  try {
    const stored = localStorage.getItem(TECHNICIANS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTechniciansToStorage = (technicians: Technician[]) => {
  localStorage.setItem(TECHNICIANS_STORAGE_KEY, JSON.stringify(technicians));
};

const getStoredTeams = (): Team[] => {
  try {
    const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function Technicians() {
  const navigate = useNavigate();
  const [showAddTechnician, setShowAddTechnician] = useState(false);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editTechnician, setEditTechnician] = useState<Technician | null>(null);
  const [deleteTechnician, setDeleteTechnician] = useState<Technician | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setTechnicians(getStoredTechnicians());
    setTeams(getStoredTeams());
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAddTechnician = (newTechnician: Technician) => {
    const updatedTechnicians = [...technicians, newTechnician];
    setTechnicians(updatedTechnicians);
    saveTechniciansToStorage(updatedTechnicians);
  };

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    const updatedTechnicians = technicians.map(t => 
      t.id === updatedTechnician.id ? updatedTechnician : t
    );
    setTechnicians(updatedTechnicians);
    saveTechniciansToStorage(updatedTechnicians);
    setEditTechnician(null);
  };

  const handleDeleteTechnician = () => {
    if (!deleteTechnician) return;
    
    const updatedTechnicians = technicians.filter(t => t.id !== deleteTechnician.id);
    setTechnicians(updatedTechnicians);
    saveTechniciansToStorage(updatedTechnicians);
    
    toast({
      title: "Deleted",
      description: `Technician "${deleteTechnician.firstName} ${deleteTechnician.lastName}" has been deleted.`,
    });
    
    setDeleteTechnician(null);
  };

  const handleEditClick = (technician: Technician) => {
    setEditTechnician(technician);
    setShowAddTechnician(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddTechnician(open);
    if (!open) {
      setEditTechnician(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Technicians</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage your maintenance technicians</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTechnician(true)}>
            <span className="hidden sm:inline">Add Technician</span>
            <span className="sm:hidden">Add</span>
          </SmartButton>
        </div>

        {/* Technicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {technicians.map((technician, index) => (
            <div 
              key={technician.id}
              className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Technician Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {technician.firstName[0]}{technician.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        {technician.firstName} {technician.lastName}
                      </h3>
                      {technician.specialization && (
                        <p className="text-sm text-muted-foreground">{technician.specialization}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(technician)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit Technician"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTechnician(technician)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete Technician"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Technician Details */}
              <div className="p-4 sm:p-5 space-y-3">
                {technician.teamName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span 
                      onClick={() => navigate('/teams')} 
                      className="font-medium text-primary hover:underline cursor-pointer"
                    >
                      {technician.teamName}
                    </span>
                  </div>
                )}
                {technician.experience && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{technician.experience} years experience</span>
                  </div>
                )}
                {technician.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{technician.email}</span>
                  </div>
                )}
                {technician.mobileNo && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{technician.mobileNo}</span>
                  </div>
                )}
                {technician.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{technician.address}</span>
                  </div>
                )}
                {technician.age && (
                  <div className="text-sm text-muted-foreground">
                    Age: {technician.age} years
                  </div>
                )}
                {technician.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(technician.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {technicians.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <HardHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No technicians found.</p>
            <p className="text-sm mt-2">Click "Add Technician" to create one.</p>
          </div>
        )}
      </div>
      
      <AddTechnicianDialog 
        open={showAddTechnician} 
        onOpenChange={handleDialogClose}
        onTechnicianAdded={handleAddTechnician}
        editTechnician={editTechnician}
        onTechnicianUpdated={handleUpdateTechnician}
        teams={teams}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTechnician} onOpenChange={(open) => !open && setDeleteTechnician(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Technician</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTechnician?.firstName} {deleteTechnician?.lastName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTechnician}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
