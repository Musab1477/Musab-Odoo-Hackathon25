import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SmartButton } from '@/components/ui/SmartButton';
import { 
  ArrowLeft, 
  Cog, 
  MapPin, 
  Calendar, 
  Shield, 
  Users,
  Wrench,
  Briefcase,
  User,
  HardHat,
  Tag
} from 'lucide-react';
import { Equipment } from '@/components/dialogs/AddEquipmentDialog';

// Helper function for localStorage
const EQUIPMENT_STORAGE_KEY = 'gearguard_equipment';

const getStoredEquipment = (): Equipment[] => {
  try {
    const stored = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    const allEquipment = getStoredEquipment();
    const found = allEquipment.find(e => e.id === id);
    setEquipment(found || null);
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!equipment) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Cog className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Equipment not found.</p>
          <Link to="/equipment" className="text-primary hover:underline mt-4 inline-block">
            Back to Equipment
          </Link>
        </div>
      </MainLayout>
    );
  }

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

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <Cog className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="page-title font-display">{equipment.name}</h1>
              <p className="text-muted-foreground">{equipment.serialNumber || 'No serial number'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                General Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="font-medium">{equipment.category || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(equipment.status)}`} />
                    <span className="font-medium">{getStatusLabel(equipment.status)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Serial Number</label>
                  <p className="font-medium">{equipment.serialNumber || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Location</label>
                  <p className="font-medium">{equipment.location || '-'}</p>
                </div>
              </div>
            </div>

            {/* Location & Dates */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Dates & Warranty
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <p className="font-medium">{equipment.location || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Purchase Date</label>
                    <p className="font-medium">{formatDate(equipment.purchaseDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Warranty Expiry</label>
                    <p className="font-medium">{formatDate(equipment.warrantyExpiry)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Created At</label>
                    <p className="font-medium">{formatDate(equipment.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  Recent Maintenance Requests
                </h3>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No maintenance requests yet.</p>
                <p className="text-sm mt-1">Create a maintenance request from the Requests page.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workcenter */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Work Center</h3>
              </div>
              <div>
                {equipment.workcenterName ? (
                  <p 
                    onClick={() => navigate('/workcenters')}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    {equipment.workcenterName}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Not assigned</p>
                )}
              </div>
            </div>

            {/* Maintenance Team */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Maintenance Team</h3>
              </div>
              <div>
                {equipment.teamName ? (
                  <p 
                    onClick={() => navigate('/teams')}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    {equipment.teamName}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Not assigned</p>
                )}
              </div>
            </div>

            {/* Assigned Technician */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <HardHat className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Assigned Technician</h3>
              </div>
              <div>
                {equipment.assignedTechnicianName ? (
                  <p 
                    onClick={() => navigate('/users/technicians')}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    {equipment.assignedTechnicianName}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Not assigned</p>
                )}
              </div>
            </div>

            {/* Used By */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Used By</h3>
              </div>
              <div>
                {equipment.usedByName ? (
                  <p 
                    onClick={() => navigate('/users/employees')}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    {equipment.usedByName}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Not assigned</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="form-section bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to={`/requests/new?equipmentId=${id}`}
                  className="block"
                >
                  <SmartButton className="w-full justify-start">
                    <Wrench className="w-4 h-4 mr-2" />
                    Create Maintenance Request
                  </SmartButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
