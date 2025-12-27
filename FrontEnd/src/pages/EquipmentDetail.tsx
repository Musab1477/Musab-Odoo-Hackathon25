import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { equipment, maintenanceRequests } from '@/data/mockData';
import { SmartButton } from '@/components/ui/SmartButton';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { TechnicianAvatar } from '@/components/ui/TechnicianAvatar';
import { 
  ArrowLeft, 
  Edit, 
  Cog, 
  MapPin, 
  Calendar, 
  Shield, 
  Users,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eq = equipment.find(e => e.id === id);

  if (!eq) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Equipment not found.</p>
          <Link to="/equipment" className="text-primary hover:underline mt-4 inline-block">
            Back to Equipment
          </Link>
        </div>
      </MainLayout>
    );
  }

  const relatedRequests = maintenanceRequests.filter(r => r.equipmentId === id);
  const openRequests = relatedRequests.filter(r => r.status === 'New' || r.status === 'In Progress');

  const getStatusColor = (status: typeof eq.status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'under-maintenance': return 'bg-yellow-500';
      case 'scrapped': return 'bg-red-500';
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
              <h1 className="page-title font-display">{eq.name}</h1>
              <p className="text-muted-foreground">{eq.serialNumber}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <SmartButton 
              icon={<Wrench className="w-4 h-4" />}
              badge={openRequests.length}
              onClick={() => navigate(`/equipment/${id}/requests`)}
            >
              Maintenance
            </SmartButton>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">General Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="font-medium">{eq.category}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Department</label>
                  <p className="font-medium">{eq.department}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(eq.status)}`} />
                    <span className="font-medium capitalize">{eq.status.replace('-', ' ')}</span>
                  </div>
                </div>
                {eq.assignedEmployee && (
                  <div>
                    <label className="text-sm text-muted-foreground">Assigned Employee</label>
                    <p className="font-medium">{eq.assignedEmployee}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Dates */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">Location & Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <p className="font-medium">{eq.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Purchase Date</label>
                    <p className="font-medium">{new Date(eq.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm text-muted-foreground">Warranty Expiry</label>
                    <p className="font-medium">{new Date(eq.warrantyExpiry).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="form-section">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Maintenance Requests</h3>
                <Link to={`/equipment/${id}/requests`} className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              {relatedRequests.length > 0 ? (
                <div className="space-y-3">
                  {relatedRequests.slice(0, 3).map(req => (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-lg bg-muted/50 ${req.isOverdue ? 'overdue-indicator' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/requests/${req.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {req.subject}
                        </Link>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{req.type}</span>
                        <PriorityBadge priority={req.priority} />
                        {req.assignedTechnician && (
                          <div className="flex items-center gap-1">
                            <TechnicianAvatar name={req.assignedTechnician.name} size="sm" />
                            <span>{req.assignedTechnician.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No maintenance requests yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Maintenance Team */}
            <div className="form-section">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Maintenance Team</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Team</label>
                  <p className="font-medium">{eq.maintenanceTeam.name}</p>
                </div>
                {eq.defaultTechnician && (
                  <div>
                    <label className="text-sm text-muted-foreground">Default Technician</label>
                    <div className="flex items-center gap-2 mt-1">
                      <TechnicianAvatar name={eq.defaultTechnician.name} size="sm" />
                      <span className="font-medium">{eq.defaultTechnician.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {eq.notes && (
              <div className="form-section">
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-muted-foreground text-sm">{eq.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="form-section">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to={`/requests/new?equipmentId=${id}`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Wrench className="w-4 h-4 mr-2" />
                    Create Maintenance Request
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
