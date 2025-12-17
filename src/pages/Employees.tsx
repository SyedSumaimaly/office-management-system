import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card'; // Removed unnecessary CardHeader, CardTitle
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, Trash2, Mail, Calendar, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Define the expected structure for type safety
interface Employee {
  id: string;
  name: string;
  email: string;
  designation?: string;
  createdAt: string;
}

export default function Employees() {
  // Renamed getEmployees to fetchEmployees for clarity
  const { isSuperAdmin, getEmployees: fetchEmployees, deleteEmployee } = useAuth();

  // STATE HOOKS for data and UI management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // 1. ASYNC FETCH LOGIC wrapped in useCallback


  // 2. EFFECT HOOK to trigger data fetching
  useEffect(() => {
    // Define the async function inside the effect
    const loadEmployees = async () => {
      setIsLoading(true);
      try {
        const result = await fetchEmployees();

        if (result && Array.isArray(result)) {
          setEmployees(result as Employee[]);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error loading employees:", error);
        // We don't use the 'toast' dependency here to prevent re-running the effect
      } finally {
        setIsLoading(false);
      }
    };

    if (isSuperAdmin) {
      loadEmployees();
    } else if (isSuperAdmin === false) {
      setIsLoading(false);
    }

    // DEPENDENCY ARRAY: We only depend on the stable `fetchEmployees` function 
    // from the hook, the stable 'refreshKey', and 'isSuperAdmin'.
  }, [isSuperAdmin, refreshKey]);

  // --- RENDER STAGE 1: Authorization Check ---
  if (isSuperAdmin === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="border-border/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Only Super Admins can view employees.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDER STAGE 2: Loading Check ---
  if (isLoading || isSuperAdmin === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- MAIN LOGIC ---
  const filteredEmployees = employees.filter(
    emp => emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    // Assuming deleteEmployee is now async and returns { success: boolean, error?: string }
    const result = await deleteEmployee(id);

    if (result?.success) {
      toast({ title: 'Employee deleted', description: `${name} has been removed.` });
      setRefreshKey(prev => prev + 1);
    } else {
      toast({ title: 'Error', description: result?.error || `Failed to delete ${name}.`, variant: 'destructive' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // --- RENDER STAGE 3: Content ---
  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Employees
          </h2>
          <p className="text-muted-foreground mt-1">{employees.length} total employees</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEmployees.length === 0 && !search ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No employees yet. Create your first employee.
            </p>
          </CardContent>
        </Card>
      ) : filteredEmployees.length === 0 && search ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No employees found matching "{search}".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{employee.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {employee.designation || 'Staff'}
                      </span>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {employee.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(employee.id, employee.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(employee.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}