import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CreditCard, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, isSuperAdmin, getEmployees } = useAuth();

  const [employees, setEmployees] = useState([]);
  

  useEffect(() => {
    getEmployees().then((data) => {
      setEmployees(Array.isArray(data) ? data : []);
    });
  }, [getEmployees]);


  const stats = isSuperAdmin
    ? [
      { title: 'Total Employees', value: (employees?.length || 0).toString(), icon: Users, color: 'text-blue-500' },
      { title: 'Active Today', value: '0', icon: Clock, color: 'text-green-500' },
      { title: 'Payment Links', value: '0', icon: CreditCard, color: 'text-purple-500' },
      { title: 'Revenue', value: '$0', icon: TrendingUp, color: 'text-orange-500' },
    ]
    : [
      { title: 'Hours Today', value: '0h', icon: Clock, color: 'text-green-500' },
      { title: 'Links Created', value: '0', icon: CreditCard, color: 'text-purple-500' },
      { title: 'This Week', value: '0h', icon: TrendingUp, color: 'text-orange-500' },
    ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-muted-foreground mt-1">
          {isSuperAdmin
            ? "Here's an overview of your organization"
            : "Here's your dashboard overview"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isSuperAdmin && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No employees yet. Create your first employee from the sidebar.
              </p>
            ) : (
              <div className="space-y-3">
                {employees.slice(0, 5).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {(emp as any).designation || 'Staff'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
