import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Cog,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import { MaintenanceRequestData } from './RequestForm';

const REQUESTS_STORAGE_KEY = 'gearguard_requests';

const getStoredRequests = (): MaintenanceRequestData[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<MaintenanceRequestData | null>(null);

  useEffect(() => {
    const requests = getStoredRequests();
    const found = requests.find(r => r.id === id);
    setRequest(found || null);
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Repaired': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Scrap': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!request) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
            <h1 className="page-title font-display">{request.subject}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
                {request.priority} Priority
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                request.type === 'Corrective' 
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {request.type}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment */}
            <div className="form-section">
              <div className="flex items-center gap-2 mb-4">
                <Cog className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Equipment</h3>
              </div>
              <Link 
                to={`/equipment`}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cog className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium hover:text-primary transition-colors">
                    {request.equipmentName || 'No equipment'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Notes & Instructions */}
            {(request.notes || request.instruction) && (
              <div className="form-section">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Notes & Instructions</h3>
                </div>
                <div className="space-y-4">
                  {request.notes && (
                    <div>
                      <label className="text-sm text-muted-foreground">Notes</label>
                      <p className="mt-1">{request.notes}</p>
                    </div>
                  )}
                  {request.instruction && (
                    <div>
                      <label className="text-sm text-muted-foreground">Instructions</label>
                      <p className="mt-1">{request.instruction}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(request.createdAt)}
                    </p>
                  </div>
                </div>
                {request.type === 'Preventive' && request.scheduledDate && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(request.scheduledDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment - Team & Members */}
            <div className="form-section">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Assigned Team</h3>
              </div>
              {request.teamName ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Team</label>
                    <p className="font-medium">{request.teamName}</p>
                  </div>
                  {request.teamMembers && request.teamMembers.length > 0 && (
                    <div>
                      <label className="text-sm text-muted-foreground">Team Members</label>
                      <div className="space-y-2 mt-2">
                        {request.teamMembers.map((member) => (
                          <div 
                            key={member.id} 
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No team assigned</p>
              )}
            </div>

            {/* Duration (for Preventive) */}
            {request.type === 'Preventive' && request.durationHours && (
              <div className="form-section">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Duration</h3>
                </div>
                <p className="text-2xl font-bold">{request.durationHours}h</p>
                <p className="text-sm text-muted-foreground">Estimated hours</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
