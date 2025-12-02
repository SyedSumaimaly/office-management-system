import { Profile } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Building2, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  profile: Profile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="bg-card border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Office Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                {getGreeting()}, {profile?.name || 'Employee'}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <Badge 
                variant="outline" 
                className="hidden sm:inline-flex px-3 py-1 text-sm"
              >
                {profile.designation}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
