import { AttendanceRecord } from '@/types/dashboard';
import { formatTime, formatDuration, formatDate } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceCardProps {
  attendance: AttendanceRecord | null;
  elapsedMinutes: number;
  onClockIn: () => void;
  onClockOut: () => void;
}

export function AttendanceCard({ 
  attendance, 
  elapsedMinutes, 
  onClockIn, 
  onClockOut 
}: AttendanceCardProps) {
  const isClockedIn = attendance?.status === 'ClockedIn';
  const today = new Date();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's date */}
        <div className="text-center pb-2 border-b border-border/50">
          <p className="text-sm text-muted-foreground">{formatDate(today)}</p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center py-4">
          <div className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-colors",
            isClockedIn 
              ? "bg-primary/10 text-primary" 
              : "bg-muted/30 text-muted-foreground"
          )}>
            <div className={cn(
              "w-3 h-3 rounded-full",
              isClockedIn ? "bg-primary animate-pulse" : "bg-muted-foreground"
            )} />
            {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
          </div>
        </div>

        {/* Time info grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <LogIn className="h-3 w-3" />
              Clock In
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatTime(attendance?.clockInTime || null)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <LogOut className="h-3 w-3" />
              Clock Out
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatTime(attendance?.clockOutTime || null)}
            </p>
          </div>
        </div>

        {/* Duration */}
        {isClockedIn && (
          <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-primary/5 border border-primary/10">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Working Time:</span>
            <span className="text-lg font-bold text-primary">
              {formatDuration(elapsedMinutes)}
            </span>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          {isClockedIn ? (
            <Button 
              onClick={onClockOut} 
              variant="outline"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Clock Out
            </Button>
          ) : (
            <Button onClick={onClockIn} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
