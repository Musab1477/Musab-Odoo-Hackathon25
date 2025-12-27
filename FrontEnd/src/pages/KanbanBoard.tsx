import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { maintenanceRequests, maintenanceTeams } from '@/data/mockData';
import { MaintenanceRequest, RequestStatus } from '@/types';
import { PriorityBadge } from '@/components/ui/StatusBadge';
import { TechnicianAvatar } from '@/components/ui/TechnicianAvatar';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Calendar, Clock, AlertTriangle, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns: { status: RequestStatus; title: string; color: string }[] = [
  { status: 'New', title: 'New', color: 'hsl(var(--status-new))' },
  { status: 'In Progress', title: 'In Progress', color: 'hsl(var(--status-in-progress))' },
  { status: 'Repaired', title: 'Repaired', color: 'hsl(var(--status-repaired))' },
  { status: 'Scrap', title: 'Scrap', color: 'hsl(var(--status-scrap))' },
];

export default function KanbanBoard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team');
  
  const [requests, setRequests] = useState<MaintenanceRequest[]>(maintenanceRequests);
  const [draggedItem, setDraggedItem] = useState<MaintenanceRequest | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RequestStatus | null>(null);

  // Get team name for display
  const filteredTeam = teamFilter ? maintenanceTeams.find(t => t.id === teamFilter) : null;

  // Filter requests by team if filter is active
  const filteredRequests = teamFilter
    ? requests.filter(r => r.maintenanceTeamId === teamFilter)
    : requests;

  const handleDragStart = (e: React.DragEvent, request: MaintenanceRequest) => {
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
      setRequests(prev => 
        prev.map(req => 
          req.id === draggedItem.id 
            ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
            : req
        )
      );
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const getRequestsByStatus = (status: RequestStatus) => 
    filteredRequests.filter(r => r.status === status);

  const clearFilter = () => {
    setSearchParams({});
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

        {/* Team Filter Badge */}
        {filteredTeam && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by team:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {filteredTeam.name}
              <button
                onClick={clearFilter}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

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
                      request.isOverdue ? 'overdue-indicator' : ''
                    } ${draggedItem?.id === request.id ? 'dragging' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Overdue Warning */}
                    {request.isOverdue && (
                      <div className="flex items-center gap-1 text-destructive text-xs mb-2">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overdue</span>
                      </div>
                    )}

                    {/* Title & Type */}
                    <div className="font-medium hover:text-primary transition-colors mb-2">
                      {request.subject}
                    </div>

                    {/* Equipment */}
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {request.equipment?.name}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        request.type === 'Corrective' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {request.type}
                      </span>
                      <PriorityBadge priority={request.priority} />
                    </div>

                    {/* Request Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Scheduled Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</span>
                    </div>

                    {/* Notes/Description preview */}
                    {request.description && (
                      <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
                        <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{request.description}</span>
                      </div>
                    )}

                    {/* Duration (for completed or preventive) */}
                    {request.duration && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{request.duration}h duration</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      {request.assignedTechnician ? (
                        <TechnicianAvatar name={request.assignedTechnician.name} size="sm" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </div>
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
      </div>
    </MainLayout>
  );
}
