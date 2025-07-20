
/**
 * ShadCN Integration Demo Component
 * 
 * This comprehensive demo showcases the enhanced ShadCN UI integration with:
 * - Modern theme provider
 * - Enhanced form components
 * - Accessibility features
 * - Responsive design
 * - Component composition patterns
 */

import * as React from 'react';
const { useState } = React;
type Component<P = {}, S = {}> = React.Component<P, S>;
type FC<T = {}> = React.FC<T>;

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

// Enhanced Form Components
import {
  TextField,
  SelectField,
  TextareaField,
  CheckboxField,
  SwitchField,
  FormGroup,
  FormSection
} from '@/components/ui/enhanced-form'

// Theme Components
import { ModeToggle, useShadCNTheme } from '@/components/providers/ShadCNThemeProvider'

// Icons
import { CheckCircle, AlertCircle, Settings, User, Mail, Lock } from 'lucide-react'

// Demo Form Schema
const demoFormSchema = z.object({
  // User Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'user', 'moderator'], {
    required_error: 'Please select a role'
  }),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  
  // Preferences
  notifications: z.boolean().default(false),
  newsletter: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  
  // Settings
  privacy: z.enum(['public', 'private', 'friends'], {
    required_error: 'Please select a privacy setting'
  })
})

type DemoFormValues = z.infer<typeof demoFormSchema>

const ShadCNIntegrationDemo: FC = () => {
  const [activeTab, setActiveTab] = useState('components')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const { theme } = useShadCNTheme()

  // Form setup
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      role: 'user',
      bio: '',
      notifications: false,
      newsletter: true,
      darkMode: theme === 'dark',
      privacy: 'private'
    }
  })

  const onSubmit = async (data: DemoFormValues) => {
    setIsSubmitting(true)
    
    // Simulate form submission with progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('Form submitted:', data)
    setIsSubmitting(false)
    setProgress(0)
    
    // Show success message
    alert('Form submitted successfully!')
  }

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' }
  ]

  const privacyOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'friends', label: 'Friends Only' }
  ]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                ShadCN UI Integration Demo
              </CardTitle>
              <CardDescription>
                Comprehensive showcase of enhanced ShadCN components with modern patterns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={theme === 'dark' ? 'default' : 'secondary'}>
                {theme} mode
              </Badge>
              <ModeToggle />
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="forms">Enhanced Forms</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Enhanced Cards
                  </CardTitle>
                  <CardDescription>
                    Cards with action support and improved styling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This card demonstrates the enhanced card component with proper spacing and typography.
                  </p>
                </CardContent>
                <CardAction>
                  <Button variant="outline" size="sm">Learn More</Button>
                  <Button size="sm">Get Started</Button>
                </CardAction>
              </Card>

              {/* Theme Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme System</CardTitle>
                  <CardDescription>Dynamic theming with CSS variables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-primary rounded" title="Primary" />
                    <div className="h-8 bg-secondary rounded" title="Secondary" />
                    <div className="h-8 bg-accent rounded" title="Accent" />
                    <div className="h-8 bg-muted rounded" title="Muted" />
                  </div>
                </CardContent>
              </Card>

              {/* Status Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Indicators</CardTitle>
                  <CardDescription>Various status and feedback components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is a sample alert with proper styling
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Progress value={progress || 33} className="w-full" />
                    <p className="text-xs text-muted-foreground">Progress indicator</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Form Components</CardTitle>
                <CardDescription>
                  Improved form fields with accessibility, validation, and better UX
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormSection 
                      title="User Information" 
                      description="Basic information about the user"
                      variant="bordered"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                          id="fullName"
                          label="Full Name"
                          required
                          placeholder="Enter your full name"
                          value={form.watch('fullName')}
                          onValueChange={(value: string) => form.setValue('fullName', value)}
                          error={form.formState.errors.fullName?.message}
                        />
                        
                        <TextField
                          id="email"
                          type="email"
                          label="Email Address"
                          required
                          placeholder="Enter your email"
                          value={form.watch('email')}
                          onValueChange={(value: string) => form.setValue('email', value)}
                          error={form.formState.errors.email?.message}
                        />
                      </div>
                      
                      <SelectField
                        label="Role"
                        required
                        placeholder="Select your role"
                        value={form.watch('role')}
                        onValueChange={(value: string) => form.setValue('role', value as any)}
                        options={roleOptions}
                        error={form.formState.errors.role?.message}
                      />
                      
                      <TextareaField
                        id="bio"
                        label="Bio"
                        description="Tell us a bit about yourself (optional)"
                        placeholder="Enter your bio..."
                        value={form.watch('bio') || ''}
                        onValueChange={(value: string) => form.setValue('bio', value)}
                        error={form.formState.errors.bio?.message}
                        rows={4}
                      />
                    </FormSection>

                    <FormSection 
                      title="Preferences" 
                      description="Configure your account preferences"
                      variant="bordered"
                    >
                      <FormGroup title="Notifications">
                        <CheckboxField
                          id="notifications"
                          label="Enable notifications"
                          description="Receive email notifications about important updates"
                          checked={form.watch('notifications')}
                          onCheckedChange={(checked: boolean) => form.setValue('notifications', checked)}
                        />
                        
                        <CheckboxField
                          id="newsletter"
                          label="Subscribe to newsletter"
                          description="Get the latest news and updates"
                          checked={form.watch('newsletter')}
                          onCheckedChange={(checked: boolean) => form.setValue('newsletter', checked)}
                        />
                      </FormGroup>
                      
                      <SwitchField
                        id="darkMode"
                        label="Dark Mode"
                        description="Use dark theme for the interface"
                        checked={form.watch('darkMode')}
                        onCheckedChange={(checked: boolean) => form.setValue('darkMode', checked)}
                      />
                      
                      <SelectField
                        label="Privacy Setting"
                        required
                        placeholder="Select privacy level"
                        value={form.watch('privacy')}
                        onValueChange={(value: string) => form.setValue('privacy', value as any)}
                        options={privacyOptions}
                        error={form.formState.errors.privacy?.message}
                      />
                    </FormSection>

                    {progress > 0 && (
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                          Processing... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="min-w-[100px]"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Composition Patterns
                  </CardTitle>
                  <CardDescription>asChild prop and component composition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    ShadCN components support the <code>asChild</code> prop for flexible composition.
                  </p>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button asChild>
                      <a href="#" className="inline-flex">Link as Button</a>
                    </Button>
                    
                    <Badge asChild>
                      <button type="button">Interactive Badge</button>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    State Management
                  </CardTitle>
                  <CardDescription>Controlled vs uncontrolled components</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All components support both controlled and uncontrolled usage patterns
                    with proper TypeScript support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
                <CardDescription>
                  Built-in accessibility with ARIA support and keyboard navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Proper ARIA attributes and roles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Keyboard navigation support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Focus management and visible focus indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Screen reader compatibility
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Color contrast compliance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Reduced motion support
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Try these keyboard shortcuts:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> Navigate forward</div>
                    <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Shift+Tab</kbd> Navigate backward</div>
                    <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> Activate button/link</div>
                    <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> Toggle checkbox/switch</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ShadCNIntegrationDemo
