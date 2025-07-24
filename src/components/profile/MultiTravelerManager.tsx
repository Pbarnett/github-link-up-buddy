import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  MapPin,
  User,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Zod schema for traveler profile validation
const travelerProfileSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  dateOfBirth: z.string().refine(date => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Please enter a valid date of birth'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  nationality: z.string().min(2, 'Please select your nationality').max(3),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  knownTravelerNumber: z.string().optional(),
  redressNumber: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  mobilityAssistance: z.boolean().optional(),
  preferredSeat: z
    .enum(['window', 'aisle', 'middle', 'no-preference'])
    .optional(),
  emailNotifications: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type TravelerProfile = z.infer<typeof travelerProfileSchema>;

interface MultiTravelerManagerProps {
  travelers: TravelerProfile[];
  onAddTraveler: (traveler: Omit<TravelerProfile, 'id'>) => Promise<void>;
  onUpdateTraveler: (
    id: string,
    traveler: Partial<TravelerProfile>
  ) => Promise<void>;
  onDeleteTraveler: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  loading?: boolean;
  maxTravelers?: number;
  className?: string;
}

const NATIONALITY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  // Add more countries as needed
];

export function MultiTravelerManager({
  travelers,
  onAddTraveler,
  onUpdateTraveler,
  onDeleteTraveler,
  onSetDefault,
  loading = false,
  maxTravelers = 6,
  className = '',
}: MultiTravelerManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTraveler, setEditingTraveler] =
    useState<TravelerProfile | null>(null);
  const [deletingTraveler, setDeletingTraveler] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<TravelerProfile>({
    resolver: zodResolver(travelerProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      emailNotifications: true,
      isDefault: false,
      isActive: true,
    },
  });

  const activeTravelers = travelers.filter(t => t.isActive);

  const handleAddTraveler = async (data: TravelerProfile) => {
    try {
      // If this is the first traveler or user wants to make it default
      if (travelers.length === 0) {
        data.isDefault = true;
      }

      await onAddTraveler(data);
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Traveler added',
        description: `${data.firstName} ${data.lastName} has been added to your profiles.`,
      });
    } catch (error) {
      toast({
        title: 'Error adding traveler',
        description:
          error instanceof Error ? error.message : 'Failed to add traveler',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTraveler = async (data: TravelerProfile) => {
    if (!editingTraveler?.id) return;

    try {
      await onUpdateTraveler(editingTraveler.id, data);
      setEditingTraveler(null);
      form.reset();
      toast({
        title: 'Traveler updated',
        description: `${data.firstName} ${data.lastName}'s profile has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error updating traveler',
        description:
          error instanceof Error ? error.message : 'Failed to update traveler',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTraveler = async (id: string) => {
    try {
      await onDeleteTraveler(id);
      setDeletingTraveler(null);
      toast({
        title: 'Traveler removed',
        description: 'The traveler profile has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error removing traveler',
        description:
          error instanceof Error ? error.message : 'Failed to remove traveler',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await onSetDefault(id);
      toast({
        title: 'Default traveler updated',
        description: 'The default traveler has been changed.',
      });
    } catch (error) {
      toast({
        title: 'Error setting default',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to set default traveler',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (traveler: TravelerProfile) => {
    setEditingTraveler(traveler);
    form.reset(traveler);
  };

  const closeEditDialog = () => {
    setEditingTraveler(null);
    form.reset();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Traveler Profiles
            </CardTitle>
            <CardDescription>
              Manage profiles for yourself and family members (
              {activeTravelers.length}/{maxTravelers} travelers)
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={loading || activeTravelers.length >= maxTravelers}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Traveler
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Travelers List */}
        {activeTravelers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No traveler profiles yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first traveler profile to get started with bookings
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Traveler
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTravelers.map(traveler => (
              <div
                key={traveler.id}
                className={`p-4 border rounded-lg ${
                  traveler.isDefault
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {traveler.firstName} {traveler.lastName}
                        </h4>
                        {traveler.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {traveler.dateOfBirth && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date().getFullYear() -
                              new Date(traveler.dateOfBirth).getFullYear()}{' '}
                            years old
                          </div>
                        )}
                        {traveler.nationality && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {NATIONALITY_OPTIONS.find(
                              n => n.value === traveler.nationality
                            )?.label || traveler.nationality}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!traveler.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          traveler.id && handleSetDefault(traveler.id)
                        }
                        className="text-xs"
                      >
                        Make Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(traveler)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {activeTravelers.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          traveler.id && setDeletingTraveler(traveler.id)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Max travelers warning */}
        {activeTravelers.length >= maxTravelers && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've reached the maximum of {maxTravelers} traveler profiles.
              Remove a profile to add a new one.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Add/Edit Traveler Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingTraveler}
        onOpenChange={open => {
          if (!open) {
            setIsAddDialogOpen(false);
            closeEditDialog();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTraveler ? 'Edit Traveler Profile' : 'Add New Traveler'}
            </DialogTitle>
            <DialogDescription>
              {editingTraveler
                ? 'Update the traveler information below.'
                : 'Add a new traveler profile for booking flights.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editingTraveler ? handleUpdateTraveler : handleAddTraveler
              )}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NATIONALITY_OPTIONS.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Travel Documents */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Travel Documents (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="passportNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passport Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passportExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passport Expiry</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    closeEditDialog();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingTraveler ? 'Update Traveler' : 'Add Traveler'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingTraveler}
        onOpenChange={() => setDeletingTraveler(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Traveler Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this traveler profile? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTraveler(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingTraveler && handleDeleteTraveler(deletingTraveler)
              }
            >
              Remove Traveler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
