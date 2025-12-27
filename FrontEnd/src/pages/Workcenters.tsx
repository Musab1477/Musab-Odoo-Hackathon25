import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Plus, Search, Factory, Cog, MapPin, Building, Pencil, Trash2 } from 'lucide-react';
import { equipment } from '@/data/mockData';
import { SmartButton } from '@/components/ui/SmartButton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddWorkcenterDialog, Workcenter } from '@/components/dialogs/AddWorkcenterDialog';
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
const WORKCENTERS_STORAGE_KEY = 'gearguard_workcenters';

const getStoredWorkcenters = (): Workcenter[] => {
  try {
    const stored = localStorage.getItem(WORKCENTERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWorkcentersToStorage = (workcenters: Workcenter[]) => {
  localStorage.setItem(WORKCENTERS_STORAGE_KEY, JSON.stringify(workcenters));
};

export default function Workcenters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAddWorkcenter, setShowAddWorkcenter] = useState(false);
  const [workcenters, setWorkcenters] = useState<Workcenter[]>([]);
  const [editWorkcenter, setEditWorkcenter] = useState<Workcenter | null>(null);
  const [deleteWorkcenter, setDeleteWorkcenter] = useState<Workcenter | null>(null);

  // Load workcenters from localStorage on mount
  useEffect(() => {
    const stored = getStoredWorkcenters();
    setWorkcenters(stored);
  }, []);

  const departments = [...new Set(workcenters.map(w => w.department))];

  const filteredWorkcenters = workcenters.filter(wc => {
    const matchesSearch = wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || wc.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddWorkcenter = (newWorkcenter: Workcenter) => {
    const updatedWorkcenters = [...workcenters, newWorkcenter];
    setWorkcenters(updatedWorkcenters);
    saveWorkcentersToStorage(updatedWorkcenters);
  };

  const handleUpdateWorkcenter = (updatedWorkcenter: Workcenter) => {
    const updatedWorkcenters = workcenters.map(wc => 
      wc.id === updatedWorkcenter.id ? updatedWorkcenter : wc
    );
    setWorkcenters(updatedWorkcenters);
    saveWorkcentersToStorage(updatedWorkcenters);
    setEditWorkcenter(null);
  };

  const handleDeleteWorkcenter = () => {
    if (!deleteWorkcenter) return;
    
    const updatedWorkcenters = workcenters.filter(wc => wc.id !== deleteWorkcenter.id);
    setWorkcenters(updatedWorkcenters);
    saveWorkcentersToStorage(updatedWorkcenters);
    
    toast({
      title: "Deleted",
      description: `Workcenter "${deleteWorkcenter.name}" has been deleted.`,
    });
    
    setDeleteWorkcenter(null);
  };

  const handleEditClick = (workcenter: Workcenter) => {
    setEditWorkcenter(workcenter);
    setShowAddWorkcenter(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddWorkcenter(open);
    if (!open) {
      setEditWorkcenter(null);
    }
  };

  const getEquipmentForWorkcenter = (workcenterId: string) => 
    equipment.filter(eq => eq.workcenterId === workcenterId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'under-maintenance': return 'bg-yellow-500';
      case 'scrapped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Workcenters</h1>
            <p className="text-muted-foreground mt-1">Manage workcenters and view associated equipment</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddWorkcenter(true)}>
            Add Workcenter
          </SmartButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workcenters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Workcenters List */}
        <div className="space-y-6">
          {filteredWorkcenters.map((workcenter, index) => {
            const wcEquipment = getEquipmentForWorkcenter(workcenter.id);
            return (
              <div 
                key={workcenter.id}
                className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Workcenter Header */}
                <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Factory className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{workcenter.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{workcenter.location}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            <span>{workcenter.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Cog className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{wcEquipment.length} Equipment</span>
                      </div>
                      <button
                        onClick={() => handleEditClick(workcenter)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit Workcenter"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteWorkcenter(workcenter)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Workcenter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {workcenter.description && (
                    <p className="text-sm text-muted-foreground mt-3">{workcenter.description}</p>
                  )}
                </div>

                {/* Equipment in Workcenter */}
                <div className="p-4 sm:p-5">
                  {wcEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {wcEquipment.map(eq => (
                        <Link
                          key={eq.id}
                          to={`/equipment/${eq.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                            <Cog className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {eq.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(eq.status)}`} />
                              <span className="capitalize truncate">{eq.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                          {eq.openRequestCount > 0 && (
                            <span className="px-2 py-0.5 text-xs bg-orange-500/10 text-orange-600 rounded-full shrink-0">
                              {eq.openRequestCount}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <Cog className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No equipment assigned to this workcenter</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredWorkcenters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Factory className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No workcenters found matching your criteria.</p>
            <p className="text-sm mt-2">Click "Add Workcenter" to create one.</p>
          </div>
        )}
      </div>
      
      <AddWorkcenterDialog 
        open={showAddWorkcenter} 
        onOpenChange={handleDialogClose}
        onWorkcenterAdded={handleAddWorkcenter}
        editWorkcenter={editWorkcenter}
        onWorkcenterUpdated={handleUpdateWorkcenter}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWorkcenter} onOpenChange={(open) => !open && setDeleteWorkcenter(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workcenter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteWorkcenter?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkcenter}
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
