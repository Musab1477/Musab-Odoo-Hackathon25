import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Cog, Wrench, Tag, Pencil, Trash2, Calendar } from 'lucide-react';
import { SmartButton } from '@/components/ui/SmartButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddEquipmentDialog, Equipment } from '@/components/dialogs/AddEquipmentDialog';
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
import { Category } from './Categories';

// Helper functions for localStorage
const EQUIPMENT_STORAGE_KEY = 'gearguard_equipment';
const CATEGORIES_STORAGE_KEY = 'gearguard_categories';

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

const getStoredCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function EquipmentList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null);
  const [deleteEquipment, setDeleteEquipment] = useState<Equipment | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setEquipmentList(getStoredEquipment());
    setCategories(getStoredCategories());
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredEquipment = equipmentList.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'under-maintenance': return 'bg-yellow-500';
      case 'out-of-order': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'under-maintenance': return 'Under Maintenance';
      case 'out-of-order': return 'Out of Order';
      default: return status;
    }
  };

  const handleAddEquipment = (newEquipment: Equipment) => {
    const updated = [...equipmentList, newEquipment];
    setEquipmentList(updated);
    saveEquipmentToStorage(updated);
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    const updated = equipmentList.map(eq => 
      eq.id === updatedEquipment.id ? updatedEquipment : eq
    );
    setEquipmentList(updated);
    saveEquipmentToStorage(updated);
    setEditEquipment(null);
  };

  const handleDeleteEquipment = () => {
    if (!deleteEquipment) return;
    
    const updated = equipmentList.filter(eq => eq.id !== deleteEquipment.id);
    setEquipmentList(updated);
    saveEquipmentToStorage(updated);
    
    toast({
      title: "Deleted",
      description: `Equipment "${deleteEquipment.name}" has been deleted.`,
    });
    
    setDeleteEquipment(null);
  };

  const handleEditClick = (equipment: Equipment) => {
    setEditEquipment(equipment);
    setShowAddEquipment(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddEquipment(open);
    if (!open) {
      setEditEquipment(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Equipment</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage your company assets and equipment</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link to="/categories">
                <Tag className="w-4 h-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
            <SmartButton 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddEquipment(true)}
            >
              <span className="hidden sm:inline">Add Equipment</span>
              <span className="sm:hidden">Add</span>
            </SmartButton>
          </div>
        </div>

        {/* Mobile Manage Categories Button */}
        <div className="sm:hidden mb-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full"
          >
            <Link to="/categories">
              <Tag className="w-4 h-4 mr-2" />
              Manage Categories
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2 hidden sm:block" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((eq, index) => (
            <div 
              key={eq.id} 
              className="bg-card rounded-xl border border-border p-4 sm:p-5 hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Cog className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <Link 
                      to={`/equipment/${eq.id}`}
                      className="font-semibold hover:text-primary transition-colors block truncate"
                    >
                      {eq.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{eq.serialNumber || 'No serial number'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEditClick(eq)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title="Edit Equipment"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteEquipment(eq)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete Equipment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="truncate ml-2">{eq.category || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work Center:</span>
                  {eq.workcenterName ? (
                    <span 
                      onClick={() => navigate('/workcenters')}
                      className="truncate ml-2 text-primary hover:underline cursor-pointer"
                    >
                      {eq.workcenterName}
                    </span>
                  ) : (
                    <span className="truncate ml-2">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Team:</span>
                  {eq.teamName ? (
                    <span 
                      onClick={() => navigate('/teams')}
                      className="truncate ml-2 text-primary hover:underline cursor-pointer"
                    >
                      {eq.teamName}
                    </span>
                  ) : (
                    <span className="truncate ml-2">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Used By:</span>
                  {eq.usedByName ? (
                    <span 
                      onClick={() => navigate('/users/employees')}
                      className="truncate ml-2 text-primary hover:underline cursor-pointer"
                    >
                      {eq.usedByName}
                    </span>
                  ) : (
                    <span className="truncate ml-2">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Technician:</span>
                  {eq.assignedTechnicianName ? (
                    <span 
                      onClick={() => navigate('/users/technicians')}
                      className="truncate ml-2 text-primary hover:underline cursor-pointer"
                    >
                      {eq.assignedTechnicianName}
                    </span>
                  ) : (
                    <span className="truncate ml-2">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <span className="truncate ml-2">{formatDate(eq.purchaseDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty Expiry:</span>
                  <span className="truncate ml-2">{formatDate(eq.warrantyExpiry)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{eq.location || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(eq.status)}`} />
                    <span>{getStatusLabel(eq.status)}</span>
                  </div>
                </div>
              </div>

              {eq.createdAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(eq.createdAt)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <Link to={`/equipment/${eq.id}`}>
                  <SmartButton 
                    icon={<Wrench className="w-4 h-4" />}
                    className="w-full justify-center text-sm"
                  >
                    Maintenance
                  </SmartButton>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Cog className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No equipment found matching your criteria.</p>
            <p className="text-sm mt-2">Click "Add Equipment" to create one.</p>
          </div>
        )}
      </div>

      <AddEquipmentDialog 
        open={showAddEquipment} 
        onOpenChange={handleDialogClose}
        onEquipmentAdded={handleAddEquipment}
        editEquipment={editEquipment}
        onEquipmentUpdated={handleUpdateEquipment}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEquipment} onOpenChange={(open) => !open && setDeleteEquipment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteEquipment?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEquipment}
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
