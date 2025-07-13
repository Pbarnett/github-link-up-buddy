
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, FileText } from "lucide-react";
import { travelerProfileService, TravelerProfile } from '@/services/travelerProfileService';

type TravelerData = TravelerProfile;

interface TravelerDataFormProps {
  onSubmit: (data: TravelerData) => void;
  isLoading?: boolean;
  initialData?: Partial<TravelerData>;
  mode?: 'create' | 'edit';
}

const TravelerDataForm = ({ onSubmit, isLoading = false, initialData = {}, mode = 'create' }: TravelerDataFormProps) => {
  const [formData, setFormData] = useState<TravelerData>({
    fullName: initialData.fullName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || 'MALE',
    email: initialData.email || '',
    phone: initialData.phone || '',
    passportNumber: initialData.passportNumber || '',
    passportCountry: initialData.passportCountry || '',
    passportExpiry: initialData.passportExpiry || '',
    knownTravelerNumber: initialData.knownTravelerNumber || '',
    isPrimary: initialData.isPrimary || false,
  });

  const [errors, setErrors] = useState<Partial<TravelerData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<TravelerData> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!formData.gender) {
      // Set error flag in a separate errors object for validation
      // We can't assign string to gender field directly due to TypeScript
      // Instead, track validation in a separate errors structure
    }

    if (formData.passportNumber && formData.passportExpiry) {
      const expiryDate = new Date(formData.passportExpiry);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.passportExpiry = 'Passport must be valid for future travel';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitAction = async () => {
        try {
          let response;
          if (mode === 'edit' && initialData.id) {
            response = await travelerProfileService.updateProfile(initialData.id, formData);
            alert('Profile updated successfully!');
          } else {
            response = await travelerProfileService.createProfile(formData);
            alert('Profile created successfully!');
          }
          onSubmit(response);
        } catch (error) {
          console.error('Error saving traveler profile:', error);
          alert('Failed to save profile. Please try again.');
        }
      };

      submitAction();
    }
  };

  const handleInputChange = (field: keyof TravelerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Passenger Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter full name"
                className={errors.fullName ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`pl-10 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="knownTravelerNumber">Known Traveler Number</Label>
              <Input
                id="knownTravelerNumber"
                value={formData.knownTravelerNumber || ''}
                onChange={(e) => handleInputChange('knownTravelerNumber', e.target.value)}
                placeholder="TSA PreCheck/Global Entry"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="passportNumber">Passport Number</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="passportNumber"
                  value={formData.passportNumber || ''}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  placeholder="Enter passport number"
                  className={`pl-10 ${errors.passportNumber ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.passportNumber && <p className="text-sm text-red-500 mt-1">{errors.passportNumber}</p>}
            </div>

            <div>
              <Label htmlFor="passportCountry">Passport Country</Label>
              <Input
                id="passportCountry"
                value={formData.passportCountry || ''}
                onChange={(e) => handleInputChange('passportCountry', e.target.value)}
                placeholder="USA, CAN, etc."
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="passportExpiry">Passport Expiry</Label>
              <Input
                id="passportExpiry"
                type="date"
                value={formData.passportExpiry || ''}
                onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                className={errors.passportExpiry ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.passportExpiry && <p className="text-sm text-red-500 mt-1">{errors.passportExpiry}</p>}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Important:</strong> Please ensure all information matches your travel documents exactly. 
              Any discrepancies may result in boarding denial.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Profile' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelerDataForm;
export type { TravelerData };
