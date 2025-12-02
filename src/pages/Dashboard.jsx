import React, { useState, useEffect } from 'react';
import { Users, Clock, CreditCard, TrendingUp, Check } from 'lucide-react';

// --- MOCK UI COMPONENTS (Simplified functional versions for stability) ---

const Card = ({ children, className }) => <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-4 ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`flex flex-col space-y-1.5 pb-2 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;
const CardContent = ({ children, className }) => <div className={`pt-0 ${className}`}>{children}</div>;

// --- MOCK DATA AND HOOKS ---

const mockEmployees = [
  { id: 'e1', name: 'Alice Smith', email: 'alice.s@corp.com', designation: 'Software Engineer' },
  { id: 'e2', name: 'Bob Johnson', email: 'bob.j@corp.com', designation: 'Product Manager' },
  { id: 'e3', name: 'Charlie Brown', email: 'charlie.b@corp.com', designation: 'HR Specialist' },
  { id: 'e4', name: 'Diana Prince', email: 'diana.p@corp.com', designation: 'Financial Analyst' },
  { id: 'e5', name: 'Evan Ross', email: 'evan.r@corp.com', designation: 'Sales Executive' },
  { id: 'e6', name: 'Fiona Glen', email: 'fiona.g@corp.com', designation: 'Operations Coordinator' },
];

// Mock implementation of useAuth hook
const useAuth = () => {
    // Determine a mock user state based on local storage or a default value
    const [mockAuthState, setMockAuthState] = useState({
        user: { name: 'Alex Johnson', id: 'user-123' },
        isSuperAdmin: true, // Default to Admin view for demonstration
    });

    // Mock getEmployees function
    const getEmployees = () => mockEmployees;

    // Mock toggle function for demonstration purposes
    const toggleAdmin = () => {
        setMockAuthState(prev => ({
            ...prev,
            isSuperAdmin: !prev.isSuperAdmin,
            user: {
                name: prev.isSuperAdmin ? 'Jane Doe (Employee)' : 'Alex Johnson (Admin)',
                id: prev.isSuperAdmin ? 'emp-456' : 'user-123'
            }
        }));
    };

    return { 
        ...mockAuthState,
        getEmployees, 
        toggleAdmin // Expose for UI control
    };
};

// --- DASHBOARD COMPONENT ---

export default function Dashboard() {
  const { user, isSuperAdmin, getEmployees, toggleAdmin } = useAuth();
  const employees = getEmployees();

  // Define the statistics based on user role
  const stats = isSuperAdmin
    ? [
        { title: 'Total Employees', value: employees.length.toString(), icon: Users, color: 'text-blue-600' },
        { title: 'Active Today', value: '4', icon: Clock, color: 'text-green-600' },
        { title: 'Payment Links', value: '12', icon: CreditCard, color: 'text-purple-600' },
        { title: 'Monthly Revenue', value: '$85k', icon: TrendingUp, color: 'text-orange-600' },
      ]
    : [
        { title: 'Hours Logged Today', value: '8.0h', icon: Clock, color: 'text-green-600' },
        { title: 'Links Created', value: '3', icon: CreditCard, color: 'text-purple-600' },
        { title: 'Productivity Score', value: '92%', icon: TrendingUp, color: 'text-orange-600' },
        { title: 'Next Review', value: 'Oct 2025', icon: Check, color: 'text-blue-600' },
      ];

  // Utility component to render the dashboard statistics card
  const StatCard = ({ stat }) => (
    <Card className="border-border/50 transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {stat.title}
        </CardTitle>
        <stat.icon className={`h-5 w-5 ${stat.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mt-1">{stat.value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
                Welcome back, {user?.name || 'User'}!
            </h2>
            <p className="text-lg text-gray-600 mt-1">
                {isSuperAdmin 
                    ? "Here's an executive overview of your organization's performance." 
                    : "Here's your personal dashboard overview."}
            </p>
        </div>

        {/* Role Switcher for Demo */}
        <div className="text-sm bg-white p-2 rounded-lg shadow border cursor-pointer" onClick={toggleAdmin}>
            <span className="font-semibold text-gray-700">Role: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${isSuperAdmin ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {isSuperAdmin ? 'Super Admin' : 'Employee'} (Click to switch)
            </span>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Admin-only: Recent Employees */}
      {isSuperAdmin && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Employees</CardTitle>
            <CardDescription>Latest hires and their assigned roles.</CardDescription>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No employees yet. Use the navigation to start creating accounts.
              </p>
            ) : (
              <div className="space-y-3">
                {employees.slice(0, 5).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 rounded-xl bg-white border shadow-sm transition-transform hover:scale-[1.01]">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                        {emp.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {emp.designation || 'Staff'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employee-only: Quick Access Panel */}
      {!isSuperAdmin && (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                <CardDescription>Jump quickly into your daily tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3 transition-colors hover:bg-yellow-100 cursor-pointer">
                    <Clock className="h-6 w-6 text-yellow-600" />
                    <div>
                        <p className="font-semibold">Log Hours</p>
                        <p className="text-sm text-gray-500">Record today's time sheet.</p>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center space-x-3 transition-colors hover:bg-purple-100 cursor-pointer">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <div>
                        <p className="font-semibold">Generate Payment Link</p>
                        <p className="text-sm text-gray-500">Create a new link for a client.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}