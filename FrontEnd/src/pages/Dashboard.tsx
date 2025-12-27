import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Cog, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Users,
  UserCircle,
  Factory,
  MapPin,
  Building,
  LogOut
} from 'lucide-react';
import { dashboardStats, maintenanceRequests, workcenters, equipment } from '@/data/mockData';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { TechnicianAvatar } from '@/components/ui/TechnicianAvatar';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { NewRequestDialog } from '@/components/dialogs/NewRequestDialog';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COLORS = ['hsl(24, 95%, 53%)', 'hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const recentRequests = maintenanceRequests.slice(0, 5);

  // Fetch user profile on dashboard load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token might be expired or invalid
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("access_token");
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        navigate("/login");
      } else {
        // Even if logout API fails, clear local storage and redirect
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } catch (error) {
      // On error, still clear token and redirect
      localStorage.removeItem("access_token");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
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

  const stats = [
    {
      name: 'Total Equipment',
      value: dashboardStats.totalEquipment,
      icon: Cog,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Open Requests',
      value: dashboardStats.openRequests,
      icon: ClipboardList,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      name: 'Overdue',
      value: dashboardStats.overdueRequests,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      name: 'Completed (Month)',
      value: dashboardStats.completedThisMonth,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Welcome back! Here's your maintenance overview.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setShowNewRequest(true)}
              className="smart-button"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">New</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 sm:p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
              title="User Profile"
            >
              <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 sm:p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.name} 
              className="card-stat animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.name}</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Requests by Team */}
          <div className="card-stat">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Requests by Team</h3>
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.requestsByTeam}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="team" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Requests by Category */}
          <div className="card-stat">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Requests by Category</h3>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.requestsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dashboardStats.requestsByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="card-stat">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Maintenance Requests</h3>
            <Link to="/requests" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Equipment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="table-row-hover border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/requests/${request.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {request.subject}
                      </Link>
                      {request.isOverdue && (
                        <span className="ml-2 text-xs text-destructive">(Overdue)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{request.equipment?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${request.type === 'Corrective' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {request.assignedTechnician ? (
                        <TechnicianAvatar name={request.assignedTechnician.name} size="sm" />
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workcenters Section */}
        <div className="card-stat mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Workcenters</h3>
            </div>
            <Link to="/workcenters" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workcenters.slice(0, 3).map((workcenter) => {
              const wcEquipment = getEquipmentForWorkcenter(workcenter.id);
              return (
                <Link
                  key={workcenter.id}
                  to="/workcenters"
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Factory className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                        {workcenter.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{workcenter.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building className="w-3 h-3" />
                      <span>{workcenter.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cog className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{wcEquipment.length}</span>
                    </div>
                  </div>
                  {wcEquipment.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {wcEquipment.slice(0, 3).map(eq => (
                        <span
                          key={eq.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-background rounded"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(eq.status)}`} />
                          <span className="truncate max-w-[80px]">{eq.name}</span>
                        </span>
                      ))}
                      {wcEquipment.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{wcEquipment.length - 3} more</span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <NewRequestDialog open={showNewRequest} onOpenChange={setShowNewRequest} />
    </MainLayout>
  );
}
