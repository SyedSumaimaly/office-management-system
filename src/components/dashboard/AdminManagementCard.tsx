import { useState } from 'react';
import { Profile } from '@/types/dashboard';
import { DESIGNATIONS, Designation } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  Edit2, 
  Save, 
  X, 
  Search,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminManagementCardProps {
  allProfiles: Profile[];
  currentUserId: string;
  onUpdateProfile: (profileId: string, updates: Partial<Profile>) => void;
}

export function AdminManagementCard({ 
  allProfiles, 
  currentUserId,
  onUpdateProfile 
}: AdminManagementCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesignation, setEditDesignation] = useState<Designation>('General Staff');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = allProfiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (profile: Profile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
    setEditDesignation(profile.designation);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDesignation('General Staff');
  };

  const saveEditing = (profileId: string) => {
    if (editName.trim()) {
      onUpdateProfile(profileId, { 
        name: editName.trim(), 
        designation: editDesignation 
      });
      cancelEditing();
    }
  };

  const designationColors: Record<string, string> = {
    'General Staff': 'bg-muted/30 text-muted-foreground',
    'Sales': 'bg-primary/10 text-primary',
    'Admin': 'bg-destructive/10 text-destructive',
    'Manager': 'bg-secondary/10 text-secondary',
    'HR': 'bg-purple-500/10 text-purple-600',
    'Finance': 'bg-green-500/10 text-green-600',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          Employee Management
          <Badge variant="outline" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            {allProfiles.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees..."
            className="pl-9"
          />
        </div>

        {/* Employee list */}
        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-2">
            {filteredProfiles.map((profile) => {
              const isEditing = editingId === profile.id;
              const isSelf = profile.id === currentUserId;

              return (
                <div
                  key={profile.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    isSelf 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-card border-border/50 hover:border-primary/20"
                  )}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Employee name"
                      />
                      <Select 
                        value={editDesignation} 
                        onValueChange={(v) => setEditDesignation(v as Designation)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DESIGNATIONS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => saveEditing(profile.id)}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-secondary-foreground font-semibold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground truncate">
                            {profile.name}
                          </h4>
                          {isSelf && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {profile.email}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn("mt-1 text-xs", designationColors[profile.designation])}
                        >
                          {profile.designation}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(profile)}
                        className="shrink-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No employees found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
