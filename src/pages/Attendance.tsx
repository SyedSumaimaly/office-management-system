import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square, Timer, MapPin, Calendar } from 'lucide-react';
import { formatTime, getTodayKey } from '@/utils/constants';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { API_BASE_URL } from "@/config/api";

interface AttendanceState {
  clockInTime: Date | null;
  clockOutTime: Date | null;
  status: 'ClockedIn' | 'ClockedOut';
}

export default function Attendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceState>({
    clockInTime: null,
    clockOutTime: null,
    status: 'ClockedOut'
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Constants for the 9h goal and 24h spinner scale
  const NINE_HOURS_SECONDS = 9 * 3600;
  const TWENTY_FOUR_HOURS_SECONDS = 24 * 3600;

  // SVG Properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/attendance/history/${user.id}`);
        const todayKey = getTodayKey();
        const todayRecord = res.data.find((log: any) => log.dateKey === todayKey);

        if (todayRecord) {
          setAttendance({
            clockInTime: todayRecord.clockInTime ? new Date(todayRecord.clockInTime) : null,
            clockOutTime: todayRecord.clockOutTime ? new Date(todayRecord.clockOutTime) : null,
            status: todayRecord.status,
          });
        }
      } catch (error) {
        console.log("No record found for today.");
      }
    };
    fetchAttendance();
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (attendance.status === 'ClockedIn') {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [attendance.status]);

  const calculateTotalSeconds = () => {
    if (!attendance.clockInTime) return 0;
    const end = (attendance.status === 'ClockedOut' && attendance.clockOutTime) 
      ? attendance.clockOutTime 
      : currentTime;
    return Math.floor((end.getTime() - attendance.clockInTime.getTime()) / 1000);
  };

  const totalSeconds = calculateTotalSeconds();
  
  // Progress relative to 24 hours for the visual spinner
  const dailyProgressPercent = (totalSeconds / TWENTY_FOUR_HOURS_SECONDS) * 100;
  const strokeDashoffset = circumference - (dailyProgressPercent / 100) * circumference;
  
  // Goal progress (9h)
  const isGoalReached = totalSeconds >= NINE_HOURS_SECONDS;

  const formatLiveTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const saveAttendance = async (newState: AttendanceState) => {
    setAttendance(newState);
    try {
      await axios.post(`${API_BASE_URL}/attendance/sync`, {
        userId: user?.id,
        dateKey: getTodayKey(),
        ...newState,
      });
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  const handleClockIn = () => {
    if (attendance.clockInTime) return;
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

  return (
    <div className="w-full mx-auto space-y-8 py-8 animate-in fade-in duration-500 px-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">Attendance Session</h2>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date().toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Office</span>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className={cn("h-1.5 w-full transition-colors duration-500", attendance.status === 'ClockedIn' ? "bg-blue-600" : "bg-slate-200")} />
        <CardContent className="p-8 space-y-8">
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* SVG Spinner */}
              <svg className="absolute w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
                {/* Background Track (24h) */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active Progress (Current Work) */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke={isGoalReached ? "#22c55e" : "#2563eb"} // Green if goal reached, Blue if working
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  style={{ 
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease' 
                  }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Center Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <Timer className={cn("h-8 w-8 mb-2", attendance.status === 'ClockedIn' ? "text-blue-600 animate-pulse" : "text-slate-400")} />
                <span className="text-4xl font-black font-mono tracking-tight text-[#0f172a] tabular-nums">
                  {formatLiveTimer(totalSeconds)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2">
                    {isGoalReached ? "Daily Goal Met" : "9h Work Goal"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 border border-slate-100 rounded-2xl overflow-hidden">
            <div className="p-6 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 mb-2">Clock In</span>
              <span className="text-xl font-bold text-[#0f172a]">{formatTime(attendance.clockInTime)}</span>
            </div>
            <div className="p-6 bg-slate-50/50 flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 mb-2">Clock Out</span>
              <span className="text-xl font-bold text-[#0f172a]">{formatTime(attendance.clockOutTime)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {attendance.clockOutTime ? (
              <Button disabled className="w-full h-16 rounded-2xl bg-slate-100 text-slate-400">
                <Clock className="h-5 w-5 mr-2" /> Shift Completed
              </Button>
            ) : attendance.status === 'ClockedIn' ? (
              <Button onClick={handleClockOut} className="w-full h-16 rounded-2xl bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 text-lg font-bold transition-all">
                <Square className="h-5 w-5 mr-2 fill-current" /> End Shift
              </Button>
            ) : (
              <Button onClick={handleClockIn} disabled={!!attendance.clockInTime} className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-lg font-bold transition-all">
                <Play className="h-5 w-5 mr-2 fill-current" /> Clock In Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}