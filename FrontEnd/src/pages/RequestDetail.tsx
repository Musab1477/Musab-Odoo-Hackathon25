import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { maintenanceRequests } from '@/data/mockData';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { TechnicianAvatar } from '@/components/ui/TechnicianAvatar';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Cog,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = maintenanceRequests.find(r => r.id === id);

  if (!request) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Request not found.</p>
          <Link to="/requests" className="text-primary hover:underline mt-4 inline-block">
            Back to Requests
          </Link>
        </div>
      </MainLayout>
    );
  }

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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="page-title font-display">{request.subject}</h1>
              {request.isOverdue && (
                <span className="flex items-center gap-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">
                  <AlertTriangle className="w-4 h-4" />
                  Overdue
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <span className={`text-sm ${request.type === 'Corrective' ? 'text-orange-600' : 'text-blue-600'}`}>
                {request.type}
              </span>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {request.description && (
              <div className="form-section">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{request.description}</p>
              </div>
            )}

            {/* Equipment */}
            <div className="form-section">
              <div className="flex items-center gap-2 mb-4">
                <Cog className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Equipment</h3>
              </div>
              {request.equipment && (
                <Link 
                  to={`/equipment/${request.equipment.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cog className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{request.equipment.name}</p>
                    <p className="text-sm text-muted-foreground">{request.equipment.serialNumber}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Timeline */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Scheduled</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {request.completedDate && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment */}
            <div className="form-section">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Assignment</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Maintenance Team</label>
                  <p className="font-medium">{request.maintenanceTeam?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Assigned Technician</label>
                  {request.assignedTechnician ? (
                    <div className="flex items-center gap-2 mt-1">
                      <TechnicianAvatar name={request.assignedTechnician.name} />
                      <span className="font-medium">{request.assignedTechnician.name}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Unassigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Duration */}
            {request.duration && (
              <div className="form-section">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Duration</h3>
                </div>
                <p className="text-2xl font-bold">{request.duration}h</p>
                <p className="text-sm text-muted-foreground">Hours spent on repair</p>
              </div>
            )}

            {/* Status Actions */}
            <div className="form-section">
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="space-y-2">
                {request.status === 'New' && (
                  <Button className="w-full" variant="outline">
                    Start Progress
                  </Button>
                )}
                {request.status === 'In Progress' && (
                  <>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Mark as Repaired
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Move to Scrap
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
