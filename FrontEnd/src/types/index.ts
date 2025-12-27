// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  department: string;
  assignedEmployee?: string;
  location: string;
  purchaseDate: string;
  warrantyExpiry: string;
  maintenanceTeam: MaintenanceTeam;
  defaultTechnician?: TeamMember;
  status: 'active' | 'under-maintenance' | 'scrapped';
  openRequestCount: number;
  notes?: string;
  workcenterId?: string;
}

export type EquipmentCategory = 
  | 'Machine'
  | 'Vehicle'
  | 'Computer'
  | 'Electrical'
  | 'HVAC'
  | 'Other';

// Equipment Category (for category management)
export interface EquipmentCategoryItem {
  id: string;
  name: string;
  description?: string;
}

// Workcenter Types
export interface Workcenter {
  id: string;
  name: string;
  description?: string;
  location: string;
  department: string;
}

// Maintenance Team Types
export interface MaintenanceTeam {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Technician';
  avatar?: string;
  teamId: string;
}

// Maintenance Request Types
export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  status: RequestStatus;
  priority: Priority;
  equipmentId: string;
  equipment?: Equipment;
  maintenanceTeamId: string;
  maintenanceTeam?: MaintenanceTeam;
  assignedTechnicianId?: string;
  assignedTechnician?: TeamMember;
  scheduledDate: string;
  dueDate?: string;
  completedDate?: string;
  duration?: number; // in hours
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export type RequestType = 'Corrective' | 'Preventive';

export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

// Dashboard Stats
export interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  totalRequests: number;
  openRequests: number;
  overdueRequests: number;
  completedThisMonth: number;
  requestsByTeam: { team: string; count: number }[];
  requestsByCategory: { category: string; count: number }[];
}
