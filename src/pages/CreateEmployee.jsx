import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed: import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Lock, User, Briefcase, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Removed: import { DESIGNATIONS } from '@/utils/constants';

// --- MOCK IMPLEMENTATIONS TO RESOLVE COMPILATION ERRORS ---

// Mock implementation of DESIGNATIONS
const DESIGNATIONS = [
  "Software Engineer",
  "Product Manager",
  "HR Specialist",
  "Financial Analyst",
  "Sales Executive",
  "Operations Coordinator"
];

// Mock implementation of useAuth hook
const useAuth = () => {
    // Mock function for creating an employee
    const createEmployee = async ({ name, email, password, designation }) => {
        console.log(`Mocking employee creation for: ${email}`);
        
        // Simple mock success/failure logic for demonstration
        if (email.toLowerCase().includes('fail')) {
            return { success: false, error: "Mock API Error: Invalid data detected." };
        }

        // Simulate successful creation
        return { success: true };
    };

    // Assume Super Admin role is always true for testing this page functionality
    const isSuperAdmin = true;

    return { createEmployee, isSuperAdmin };
};

// --- END MOCK IMPLEMENTATIONS ---


export default function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const [copied, setCopied] = useState(false);
  // useAuth is now the local mock function
  const { createEmployee, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="border-border/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Only Super Admins can create employees.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createEmployee({ name, email, password, designation });
    
    if (result.success) {
      toast({ title: 'Employee created!', description: `${name} has been added successfully.` });
      setCreatedEmployee({ email, password });
      setName('');
      setEmail('');
      setPassword('');
      setDesignation('');
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    
    setIsSubmitting(false);
  };

  // Note: document.execCommand('copy') is generally preferred in this environment 
  // over navigator.clipboard.writeText due to iframe security context limitations, 
  // but keeping the original code's preference here.
  const copyCredentials = async () => {
    if (createdEmployee) {
      // Fallback for document.execCommand('copy') if navigator.clipboard fails
      try {
        await navigator.clipboard.writeText(
          `Email: ${createdEmployee.email}\nPassword: ${createdEmployee.password}\nLogin URL: ${window.location.origin}/employee-login`
        );
      } catch (err) {
        // Fallback implementation if navigator.clipboard fails
        const tempElement = document.createElement('textarea');
        tempElement.value = `Email: ${createdEmployee.email}\nPassword: ${createdEmployee.password}\nLogin URL: ${window.location.origin}/employee-login`;
        document.body.appendChild(tempElement);
        tempElement.select();
        document.execCommand('copy');
        document.body.removeChild(tempElement);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create New Employee</h2>
        <p className="text-muted-foreground mt-1">Add a new employee to the system</p>
      </div>

      {createdEmployee && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Employee Created Successfully!
            </CardTitle>
            <CardDescription>Share these credentials with the employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-muted rounded-lg font-mono text-sm">
              <p><span className="text-muted-foreground">Email:</span> {createdEmployee.email}</p>
              <p><span className="text-muted-foreground">Password:</span> {createdEmployee.password}</p>
              <p><span className="text-muted-foreground">Login URL:</span> {window.location.origin}/employee-login</p>
            </div>
            <Button onClick={copyCredentials} variant="outline" className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Credentials'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Employee Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select value={designation} onValueChange={setDesignation} required>
                <SelectTrigger className="w-full">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !designation}>
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}