import { useState } from 'react';
import { Profile } from '@/types/dashboard';
import { DESIGNATIONS, Designation } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Mail, Briefcase, Save, Copy, Check } from 'lucide-react';
import { copyText } from '@/utils/constants';

interface ProfileCardProps {
  profile: Profile;
  userId: string;
  onUpdate: (updates: Partial<Profile>) => void;
}

export function ProfileCard({ profile, userId, onUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editDesignation, setEditDesignation] = useState<Designation>(profile.designation);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate({ name: editName.trim(), designation: editDesignation });
      setIsEditing(false);
    }
  };

  const handleCopyId = async () => {
    const success = await copyText(userId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar and basic info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-semibold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mb-2"
                placeholder="Your name"
              />
            ) : (
              <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Mail className="h-3 w-3" />
              {profile.email}
            </div>
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            Designation
          </Label>
          {isEditing ? (
            <Select value={editDesignation} onValueChange={(v) => setEditDesignation(v as Designation)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESIGNATIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              {profile.designation}
            </div>
          )}
        </div>

        {/* User ID */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">User ID</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-muted/20 rounded text-xs font-mono text-muted-foreground break-all">
              {userId}
            </code>
            <Button variant="ghost" size="icon" onClick={handleCopyId} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setEditName(profile.name);
                setEditDesignation(profile.designation);
              }}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
