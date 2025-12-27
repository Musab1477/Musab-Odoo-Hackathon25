import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Cog, MoreVertical, Wrench, Tag } from 'lucide-react';
import { equipment, workcenters, maintenanceTeams } from '@/data/mockData';
import { SmartButton } from '@/components/ui/SmartButton';
import { Equipment } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddEquipmentDialog } from '@/components/dialogs/AddEquipmentDialog';

export default function EquipmentList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAddEquipment, setShowAddEquipment] = useState(false);

  const categories = [...new Set(equipment.map(e => e.category))];
  const departments = [...new Set(equipment.map(e => e.department))];

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    const matchesDepartment = departmentFilter === 'all' || eq.department === departmentFilter;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'under-maintenance': return 'bg-yellow-500';
      case 'scrapped': return 'bg-red-500';
    }
  };

  const getWorkcenterName = (workcenterId?: string) => {
    if (!workcenterId) return '-';
    const wc = workcenters.find(w => w.id === workcenterId);
    return wc ? wc.name : '-';
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
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                    <p className="text-xs text-muted-foreground truncate">{eq.serialNumber}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 hover:bg-muted rounded shrink-0">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/equipment/${eq.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/equipment/${eq.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="truncate ml-2">{eq.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work Center:</span>
                  <span className="truncate ml-2">{getWorkcenterName(eq.workcenterId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Team:</span>
                  <span className="truncate ml-2">{eq.maintenanceTeam?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Used By:</span>
                  <span className="truncate ml-2">{eq.assignedEmployee || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <span className="truncate ml-2">{eq.purchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty Expiry:</span>
                  <span className="truncate ml-2">{eq.warrantyExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{eq.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(eq.status)}`} />
                    <span className="capitalize">{eq.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <Link to={`/equipment/${eq.id}/requests`}>
                  <SmartButton 
                    icon={<Wrench className="w-4 h-4" />}
                    badge={eq.openRequestCount}
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
          </div>
        )}
      </div>

      <AddEquipmentDialog open={showAddEquipment} onOpenChange={setShowAddEquipment} />
    </MainLayout>
  );
}
