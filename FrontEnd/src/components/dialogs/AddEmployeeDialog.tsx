import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  age: string;
  designation: string;
  department: string;
  address: string;
  createdAt: string;
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded?: (employee: Employee) => void;
  editEmployee?: Employee | null;
  onEmployeeUpdated?: (employee: Employee) => void;
}

export function AddEmployeeDialog({ 
  open, 
  onOpenChange,
  onEmployeeAdded,
  editEmployee,
  onEmployeeUpdated
}: AddEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    age: '',
    designation: '',
    department: '',
    address: '',
  });

  const isEditMode = !!editEmployee;

  // Populate form when editing
  useEffect(() => {
    if (editEmployee) {
      setFormData({
        firstName: editEmployee.firstName,
        lastName: editEmployee.lastName,
        email: editEmployee.email,
        mobileNo: editEmployee.mobileNo,
        age: editEmployee.age,
        designation: editEmployee.designation,
        department: editEmployee.department,
        address: editEmployee.address,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        age: '',
        designation: '',
        department: '',
        address: '',
      });
    }
  }, [editEmployee, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Mobile number validation (10 digits)
    if (formData.mobileNo.trim() && !/^\d{10}$/.test(formData.mobileNo.trim())) {
      toast({
        title: "Error",
        description: "Mobile number must be exactly 10 digits",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && editEmployee) {
      const updatedEmployee: Employee = {
        ...editEmployee,
        ...formData,
      };
      
      onEmployeeUpdated?.(updatedEmployee);
      
      toast({
        title: "Success",
        description: `Employee "${formData.firstName} ${formData.lastName}" has been updated.`,
      });
    } else {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      onEmployeeAdded?.(newEmployee);
      
      toast({
        title: "Success",
        description: `Employee "${formData.firstName} ${formData.lastName}" has been added.`,
      });
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      age: '',
      designation: '',
      department: '',
      address: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile No</Label>
              <Input
                id="mobileNo"
                name="mobileNo"
                placeholder="Enter mobile number"
                value={formData.mobileNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                placeholder="Enter designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              placeholder="Enter department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="flex justify-end pt-4">
            <SmartButton type="submit" icon={isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
              {isEditMode ? 'Save Changes' : 'Add Employee'}
            </SmartButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
