import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Calendar, Clock, Users, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MaintenanceRequestData } from './RequestForm';
import { useToast } from '@/hooks/use-toast';
import { Equipment } from '@/components/dialogs/AddEquipmentDialog';

type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';

const columns: { status: RequestStatus; title: string; color: string }[] = [
  { status: 'New', title: 'New', color: 'hsl(var(--status-new))' },
  { status: 'In Progress', title: 'In Progress', color: 'hsl(var(--status-in-progress))' },
  { status: 'Repaired', title: 'Repaired', color: 'hsl(var(--status-repaired))' },
  { status: 'Scrap', title: 'Scrap', color: 'hsl(var(--status-scrap))' },
];

const REQUESTS_STORAGE_KEY = 'gearguard_requests';
const EQUIPMENT_STORAGE_KEY = 'gearguard_equipment';

const getStoredRequests = (): MaintenanceRequestData[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRequestsToStorage = (requests: MaintenanceRequestData[]) => {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
};

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

// Update equipment status based on request status
const updateEquipmentStatus = (equipmentId: string, requestStatus: RequestStatus) => {
  const equipment = getStoredEquipment();
  const updatedEquipment = equipment.map(eq => {
    if (eq.id === equipmentId) {
      let newStatus: Equipment['status'] = 'operational';
      if (requestStatus === 'Scrap') {
        newStatus = 'out-of-order';
      } else if (requestStatus === 'New' || requestStatus === 'In Progress') {
        newStatus = 'under-maintenance';
      } else if (requestStatus === 'Repaired') {
        newStatus = 'operational';
      }
      return { ...eq, status: newStatus };
    }
    return eq;
  });
  saveEquipmentToStorage(updatedEquipment);
};

export default function KanbanBoard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<MaintenanceRequestData[]>([]);
  const [draggedItem, setDraggedItem] = useState<MaintenanceRequestData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RequestStatus | null>(null);

  // Load requests from localStorage
  useEffect(() => {
    setRequests(getStoredRequests());
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleDragStart = (e: React.DragEvent, request: MaintenanceRequestData) => {
    setDraggedItem(request);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: RequestStatus) => {
    e.preventDefault();
    if (draggedItem) {
      const updatedRequests = requests.map(req => 
        req.id === draggedItem.id 
          ? { ...req, status: newStatus }
          : req
      );
      setRequests(updatedRequests);
      saveRequestsToStorage(updatedRequests);
      
      // Update equipment status based on request status
      if (draggedItem.equipmentId) {
        updateEquipmentStatus(draggedItem.equipmentId, newStatus);
      }
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const getRequestsByStatus = (status: RequestStatus) => 
    requests.filter(r => r.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'In Progress': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Repaired': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Scrap': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditRequest = (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/requests/edit/${requestId}`);
  };

  const handleDeleteRequest = (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedRequests = requests.filter(r => r.id !== requestId);
    setRequests(updatedRequests);
    saveRequestsToStorage(updatedRequests);
    toast({
      title: "Request Deleted",
      description: "The maintenance request has been removed.",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Maintenance Requests</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Drag and drop to update request status</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/requests/new')}>
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </SmartButton>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <div
              key={column.status}
              className={`kanban-column transition-all duration-200 ${
                dragOverColumn === column.status ? 'drag-over' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-sm sm:text-base">{column.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {getRequestsByStatus(column.status).length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {getRequestsByStatus(column.status).map((request, index) => (
                  <Link
                    key={request.id}
                    to={`/requests/${request.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request)}
                    onDragEnd={handleDragEnd}
                    className={`kanban-card animate-fade-in block cursor-pointer ${
                      draggedItem?.id === request.id ? 'dragging' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header with Title and Actions */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-medium hover:text-primary transition-colors flex-1">
                        {request.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleEditRequest(e, request.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="Edit Request"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRequest(e, request.id)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Equipment */}
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {request.equipmentName || 'No equipment'}
                    </p>

                    {/* Status Badge */}
                    <div className="mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(request.status)}`}>
                        Status: {request.status}
                      </span>
                    </div>

                    {/* Type and Priority with Labels */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        request.type === 'Corrective' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        Type: {request.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(request.priority)}`}>
                        Priority: {request.priority}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(request.createdAt)}</span>
                    </div>

                    {/* Scheduled Date (for Preventive) */}
                    {request.type === 'Preventive' && request.scheduledDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>Scheduled: {formatDate(request.scheduledDate)}</span>
                      </div>
                    )}

                    {/* Duration (for Preventive) */}
                    {request.type === 'Preventive' && request.durationHours && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{request.durationHours}h duration</span>
                      </div>
                    )}

                    {/* Team Members */}
                    {request.teamMembers && request.teamMembers.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Users className="w-3 h-3" />
                          <span>{request.teamName}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {request.teamMembers.slice(0, 3).map((member) => (
                            <div 
                              key={member.id} 
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs"
                              title={member.name}
                            >
                              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-[8px] font-medium text-primary">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="truncate max-w-[60px]">{member.name.split(' ')[0]}</span>
                            </div>
                          ))}
                          {request.teamMembers.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{request.teamMembers.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                ))}

                {getRequestsByStatus(column.status).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No requests
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No maintenance requests yet.</p>
            <p className="text-sm mt-2">Click "New Request" to create one.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
