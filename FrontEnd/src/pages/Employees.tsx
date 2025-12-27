import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, UserCircle, Pencil, Trash2, Mail, Phone, Building, MapPin, Calendar } from 'lucide-react';
import { AddEmployeeDialog, Employee } from '@/components/dialogs/AddEmployeeDialog';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper functions for localStorage
const EMPLOYEES_STORAGE_KEY = 'gearguard_employees';

const getStoredEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEmployeesToStorage = (employees: Employee[]) => {
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
};

export default function Employees() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  // Load employees from localStorage on mount
  useEffect(() => {
    const stored = getStoredEmployees();
    setEmployees(stored);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveEmployeesToStorage(updatedEmployees);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const updatedEmployees = employees.map(e => 
      e.id === updatedEmployee.id ? updatedEmployee : e
    );
    setEmployees(updatedEmployees);
    saveEmployeesToStorage(updatedEmployees);
    setEditEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!deleteEmployee) return;
    
    const updatedEmployees = employees.filter(e => e.id !== deleteEmployee.id);
    setEmployees(updatedEmployees);
    saveEmployeesToStorage(updatedEmployees);
    
    toast({
      title: "Deleted",
      description: `Employee "${deleteEmployee.firstName} ${deleteEmployee.lastName}" has been deleted.`,
    });
    
    setDeleteEmployee(null);
  };

  const handleEditClick = (employee: Employee) => {
    setEditEmployee(employee);
    setShowAddEmployee(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddEmployee(open);
    if (!open) {
      setEditEmployee(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Employees</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage your organization's employees</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddEmployee(true)}>
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </SmartButton>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {employees.map((employee, index) => (
            <div 
              key={employee.id}
              className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Employee Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      {employee.designation && (
                        <p className="text-sm text-muted-foreground">{employee.designation}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit Employee"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteEmployee(employee)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.mobileNo && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{employee.mobileNo}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{employee.department}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{employee.address}</span>
                  </div>
                )}
                {employee.age && (
                  <div className="text-sm text-muted-foreground">
                    Age: {employee.age} years
                  </div>
                )}
                {employee.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(employee.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No employees found.</p>
            <p className="text-sm mt-2">Click "Add Employee" to create one.</p>
          </div>
        )}
      </div>
      
      <AddEmployeeDialog 
        open={showAddEmployee} 
        onOpenChange={handleDialogClose}
        onEmployeeAdded={handleAddEmployee}
        editEmployee={editEmployee}
        onEmployeeUpdated={handleUpdateEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEmployee} onOpenChange={(open) => !open && setDeleteEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteEmployee?.firstName} {deleteEmployee?.lastName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
