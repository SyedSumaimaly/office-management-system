import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square, Timer } from 'lucide-react';
import { formatTime, formatDuration, getTodayKey } from '@/utils/constants';

export default function Attendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem(`attendance_${user?.id}_${getTodayKey()}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        clockInTime: parsed.clockInTime ? new Date(parsed.clockInTime) : null,
        clockOutTime: parsed.clockOutTime ? new Date(parsed.clockOutTime) : null,
      };
    }
    return { clockInTime: null, clockOutTime: null, status: 'ClockedOut' };
  });
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (attendance.status === 'ClockedIn' && attendance.clockInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        // Removed the non-null assertion operator (!) as it's not needed in JS
        const diff = Math.floor((now.getTime() - attendance.clockInTime.getTime()) / 60000); 
        setElapsedMinutes(diff);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedMinutes(0);
    }
  }, [attendance.status, attendance.clockInTime]);

  // Removed type annotation for newState
  const saveAttendance = (newState) => {
    localStorage.setItem(`attendance_${user?.id}_${getTodayKey()}`, JSON.stringify(newState));
    setAttendance(newState);
  };

  const handleClockIn = () => {
    saveAttendance({
      clockInTime: new Date(),
      clockOutTime: null,
      status: 'ClockedIn',
    });
  };

  const handleClockOut = () => {
    saveAttendance({
      ...attendance,
      clockOutTime: new Date(),
      status: 'ClockedOut',
    });
  };

  const totalWorked = attendance.clockInTime && attendance.clockOutTime
    ? Math.floor((attendance.clockOutTime.getTime() - attendance.clockInTime.getTime()) / 60000)
    : elapsedMinutes;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Attendance
        </h2>
        <p className="text-muted-foreground mt-1">Track your daily attendance</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Today's Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              attendance.status === 'ClockedIn' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <div className="text-center">
                <Timer className="h-8 w-8 mx-auto mb-1" />
                <span className="text-2xl font-bold">{formatDuration(totalWorked)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Clock In</p>
              <p className="text-lg font-semibold text-foreground">
                {formatTime(attendance.clockInTime)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Clock Out</p>
              <p className="text-lg font-semibold text-foreground">
                {formatTime(attendance.clockOutTime)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleClockIn}
              disabled={attendance.status === 'ClockedIn'}
              className="flex-1"
              variant={attendance.status === 'ClockedIn' ? 'secondary' : 'default'}
            >
              <Play className="h-4 w-4 mr-2" />
              Clock In
            </Button>
            <Button
              onClick={handleClockOut}
              disabled={attendance.status === 'ClockedOut' || !attendance.clockInTime}
              className="flex-1"
              variant={attendance.status === 'ClockedOut' ? 'secondary' : 'default'}
            >
              <Square className="h-4 w-4 mr-2" />
              Clock Out
            </Button>
          </div>

          {attendance.status === 'ClockedIn' && (
            <p className="text-center text-sm text-green-500 animate-pulse">
              ● Currently clocked in
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}