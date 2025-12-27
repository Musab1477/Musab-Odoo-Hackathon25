import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  ClipboardList, 
  Calendar, 
  Settings,
  Cog,
  Factory,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  ChevronRight,
  UserCog,
  HardHat,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Workcenters', href: '/workcenters', icon: Factory },
  { name: 'Teams', href: '/teams', icon: Users },
  { 
    name: 'Users', 
    icon: UserCog, 
    submenu: [
      { name: 'Employee', href: '/users/employees', icon: UserCircle },
      { name: 'Technicians', href: '/users/technicians', icon: HardHat },
    ]
  },
  { name: 'Equipment', href: '/equipment', icon: Cog },
  { name: 'Requests', href: '/requests', icon: ClipboardList },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
];

interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user || data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Auto-expand submenu if current path is in submenu
  useEffect(() => {
    navigation.forEach(item => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(sub => location.pathname === sub.href);
        if (isSubmenuActive && !expandedMenus.includes(item.name)) {
          setExpandedMenus(prev => [...prev, item.name]);
        }
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

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
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full flex flex-col transition-all duration-300 z-50",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20" : "w-64"
        )}
        style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-5 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-display font-bold text-primary-foreground">GearGuard</h1>
                <p className="text-xs text-muted-foreground">Maintenance Tracker</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-muted/20 rounded"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            // Check if item has submenu
            if (item.submenu) {
              const isExpanded = expandedMenus.includes(item.name);
              const isSubmenuActive = item.submenu.some(sub => location.pathname === sub.href);
              
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "sidebar-item w-full justify-between",
                      isSubmenuActive ? "text-primary-foreground" : "text-muted-foreground hover:text-primary-foreground"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="animate-fade-in">{item.name}</span>}
                    </div>
                    {!collapsed && (
                      isExpanded 
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {/* Submenu */}
                  {isExpanded && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1 animate-fade-in">
                      {item.submenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "sidebar-item pl-6",
                              isSubActive ? "active" : "text-muted-foreground hover:text-primary-foreground"
                            )}
                          >
                            <subItem.icon className="w-4 h-4 flex-shrink-0" />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href!}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "sidebar-item",
                  isActive ? "active" : "text-muted-foreground hover:text-primary-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="animate-fade-in">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="p-3 border-t border-border/10">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "sidebar-item w-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 mb-2",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
          
          {/* User Info */}
          {userProfile && (
            <div className={cn(
              "flex items-center gap-3 p-2 mb-2 rounded-lg bg-muted/20",
              collapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              {!collapsed && (
                <div className="min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-primary-foreground truncate">
                    {userProfile.first_name && userProfile.last_name 
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : userProfile.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                </div>
              )}
            </div>
          )}
          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className="sidebar-item text-muted-foreground hover:text-primary-foreground"
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
