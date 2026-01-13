import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_BASE_URL } from "@/config/api";
import axios from 'axios';
import { formatTime, formatDuration } from '@/utils/constants';

export default function AttendanceHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/attendance/history/${user.id}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user?.id]);

    const formatPreciseDuration = (totalSeconds: number) => {
        if (totalSeconds === 0) return "0s";
        if (!totalSeconds || totalSeconds < 0) return "--";

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0 || parts.length === 0) parts.push(`${s}s`);

        return parts.join(" ");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">My Attendance History</h2>
                <p className="text-muted-foreground mt-1">Review your past clock-in and clock-out logs</p>
            </div>

            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>History Log</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-4">Loading your logs...</p>
                    ) : history.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No attendance records found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Clock In</TableHead>
                                    <TableHead>Clock Out</TableHead>
                                    <TableHead>Total Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((record: any) => (
                                    <TableRow key={record._id}>
                                        <TableCell className="font-medium">{record.dateKey}</TableCell>
                                        <TableCell>{formatTime(new Date(record.clockInTime))}</TableCell>
                                        <TableCell>
                                            {record.clockOutTime ? formatTime(new Date(record.clockOutTime)) : '--:--'}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {record.status === 'ClockedIn' ? (
                                                <span className="text-blue-500 animate-pulse font-medium">In Progress</span>
                                            ) : (
                                                formatPreciseDuration(record.totalSeconds)
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${record.status === 'ClockedIn' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}