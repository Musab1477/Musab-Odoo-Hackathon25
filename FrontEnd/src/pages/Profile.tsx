import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { User, Mail, Phone, Calendar, Users as GenderIcon, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@gearguard.com',
    mobile: '+1 234 567 8900',
    age: '32',
    gender: 'male',
    department: 'Maintenance',
    designation: 'Senior Technician',
    employeeId: 'EMP-001',
    address: '123 Industrial Park, Tech City'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Simulate save
    toast.success('Profile updated successfully!');
  };

  return (
    <MainLayout>
      <div className="animate-fade-in max-w-3xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="page-title font-display">User Profile</h1>
              <p className="text-muted-foreground mt-1 hidden sm:block">Manage your personal information</p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Changes</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>

        {/* Profile Avatar Section */}
        <div className="card-stat mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-muted-foreground">{formData.designation}</p>
              <p className="text-sm text-muted-foreground">{formData.department}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card-stat">
          <h3 className="font-semibold mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Mobile Number
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Enter your age"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <GenderIcon className="w-4 h-4 text-muted-foreground" />
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="flex items-center gap-2">
                Employee ID
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                placeholder="Enter employee ID"
                disabled
                className="bg-muted"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Enter department"
              />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="Enter designation"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Mobile Save Button */}
          <div className="mt-6 sm:hidden">
            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
