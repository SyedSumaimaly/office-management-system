import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Building2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Office Dashboard - Employee Management System</title>
        <meta name="description" content="Modern office dashboard for employee management, attendance tracking, and payment link generation." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Office Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete employee management system with attendance tracking, payment link generation, and admin controls.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Super Admin</CardTitle>
              <CardDescription>
                Manage employees, view reports, and control the entire system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/admin-login">
                <Button className="w-full group">
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-secondary/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="h-7 w-7 text-foreground" />
              </div>
              <CardTitle>Employee</CardTitle>
              <CardDescription>
                Track attendance, create payment links, and view your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/employee-login">
                <Button variant="outline" className="w-full group">
                  Employee Login
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground mt-12">
          Demo: Use admin@company.com / admin123 for Super Admin access
        </p>
      </div>
    </>
  );
}
