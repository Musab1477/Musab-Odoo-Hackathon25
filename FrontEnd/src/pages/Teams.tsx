import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Users, Pencil, Trash2, Mail, Award, Calendar } from 'lucide-react';
import { AddTeamDialog, Team } from '@/components/dialogs/AddTeamDialog';
import { Technician } from '@/components/dialogs/AddTechnicianDialog';
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
const TEAMS_STORAGE_KEY = 'gearguard_teams';
const TECHNICIANS_STORAGE_KEY = 'gearguard_technicians';

const getStoredTeams = (): Team[] => {
  try {
    const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTeamsToStorage = (teams: Team[]) => {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
};

const getStoredTechnicians = (): Technician[] => {
  try {
    const stored = localStorage.getItem(TECHNICIANS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function Teams() {
  const navigate = useNavigate();
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setTeams(getStoredTeams());
    setTechnicians(getStoredTechnicians());
  }, []);

  // Get technicians for a specific team
  const getTechniciansForTeam = (teamId: string) => {
    return technicians.filter(t => t.teamId === teamId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAddTeam = (newTeam: Team) => {
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    saveTeamsToStorage(updatedTeams);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    const updatedTeams = teams.map(t => 
      t.id === updatedTeam.id ? updatedTeam : t
    );
    setTeams(updatedTeams);
    saveTeamsToStorage(updatedTeams);
    setEditTeam(null);
  };

  const handleDeleteTeam = () => {
    if (!deleteTeam) return;
    
    const updatedTeams = teams.filter(t => t.id !== deleteTeam.id);
    setTeams(updatedTeams);
    saveTeamsToStorage(updatedTeams);
    
    toast({
      title: "Deleted",
      description: `Team "${deleteTeam.name}" has been deleted.`,
    });
    
    setDeleteTeam(null);
  };

  const handleEditClick = (team: Team) => {
    setEditTeam(team);
    setShowAddTeam(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddTeam(open);
    if (!open) {
      setEditTeam(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Maintenance Teams</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage your maintenance teams and technicians</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTeam(true)}>
            <span className="hidden sm:inline">Add Team</span>
            <span className="sm:hidden">Add</span>
          </SmartButton>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {teams.map((team, index) => (
            <div 
              key={team.id}
              className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Team Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{getTechniciansForTeam(team.id).length} technicians</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(team)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit Team"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTeam(team)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {team.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{team.description}</p>
                )}
                {team.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(team.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Team Members Section - Shows Technicians */}
              <div className="p-4 sm:p-5">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Team Members (Technicians)</h4>
                {getTechniciansForTeam(team.id).length > 0 ? (
                  <div className="space-y-3">
                    {getTechniciansForTeam(team.id).map(technician => (
                      <div 
                        key={technician.id} 
                        onClick={() => navigate('/users/technicians')}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <span className="text-xs font-medium text-primary">
                              {technician.firstName[0]}{technician.lastName[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate group-hover:text-primary transition-colors">{technician.firstName} {technician.lastName}</p>
                            <p className="text-xs text-muted-foreground">{technician.specialization || 'Technician'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                          {technician.experience && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {technician.experience} years exp
                            </span>
                          )}
                          {technician.email && (
                            <span className="flex items-center gap-1 truncate max-w-[150px]">
                              <Mail className="w-3 h-3" />
                              {technician.email}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No technicians assigned</p>
                    <p className="text-xs mt-1">Add technicians from Users → Technicians</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No teams found.</p>
            <p className="text-sm mt-2">Click "Add Team" to create one.</p>
          </div>
        )}
      </div>
      
      <AddTeamDialog 
        open={showAddTeam} 
        onOpenChange={handleDialogClose}
        onTeamAdded={handleAddTeam}
        editTeam={editTeam}
        onTeamUpdated={handleUpdateTeam}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTeam} onOpenChange={(open) => !open && setDeleteTeam(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTeam?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTeam}
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
