import { useState, useEffect, useReducer, useCallback } from 'react';
import { Profile, AttendanceRecord, PaymentLink, Message } from '@/types/dashboard';
import { generatorReducer, initialGeneratorState, GeneratorAction } from '@/state/generatorReducer';
import { 
  Designation, 
  ADMIN_ROLES, 
  SALES_ROLES, 
  generateId, 
  getTodayKey,
  GATEWAYS 
} from '@/utils/constants';

// Mock user ID for demo purposes
const MOCK_USER_ID = 'user_' + generateId().slice(0, 8);

export function useDashboardLogic() {
  // User & Profile State
  const [userId] = useState<string>(MOCK_USER_ID);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Attendance State
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Payment Links State
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);

  // Generator State
  const [genState, genDispatch] = useReducer(generatorReducer, initialGeneratorState);

  // Message State
  const [message, setMessage] = useState<Message | null>(null);

  // Role checks
  const isAdmin = profile ? ADMIN_ROLES.includes(profile.designation as any) : false;
  const isSales = profile ? SALES_ROLES.includes(profile.designation as any) : false;

  // Show message helper
  const showMessage = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = generateId();
    setMessage({ id, text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  // Initialize mock data
  useEffect(() => {
    const initData = () => {
      // Create default profile
      const defaultProfile: Profile = {
        id: userId,
        name: 'New Employee',
        email: `employee_${userId.slice(-4)}@company.com`,
        designation: 'General Staff',
        createdAt: new Date(),
      };
      setProfile(defaultProfile);

      // Create mock all profiles for admin view
      const mockProfiles: Profile[] = [
        defaultProfile,
        {
          id: 'user_abc123',
          name: 'John Smith',
          email: 'john.smith@company.com',
          designation: 'Sales',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'user_def456',
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          designation: 'Admin',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'user_ghi789',
          name: 'Mike Wilson',
          email: 'mike.w@company.com',
          designation: 'General Staff',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
      ];
      setAllProfiles(mockProfiles);

      // Initialize attendance for today
      const todayKey = getTodayKey();
      setAttendance({
        id: `${todayKey}_${userId}`,
        userId,
        date: todayKey,
        clockInTime: null,
        clockOutTime: null,
        status: 'ClockedOut',
      });

      // Mock payment links
      const mockLinks: PaymentLink[] = [
        {
          id: generateId(),
          customerId: 'cust_001',
          customerName: 'Alice Brown',
          customerEmail: 'alice@example.com',
          amount: 299.99,
          currency: 'USD',
          gateway: 'stripe',
          description: 'Premium Package',
          link: 'https://pay.example.com/link/abc123',
          createdBy: 'user_abc123',
          createdByName: 'John Smith',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'Active',
        },
        {
          id: generateId(),
          customerId: 'cust_002',
          customerName: 'Bob Davis',
          customerEmail: 'bob@example.com',
          amount: 149.50,
          currency: 'USD',
          gateway: 'paypal',
          description: 'Standard Plan',
          link: 'https://pay.example.com/link/def456',
          createdBy: 'user_abc123',
          createdByName: 'John Smith',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'Paid',
        },
      ];
      setPaymentLinks(mockLinks);

      setIsLoading(false);
    };

    // Simulate loading delay
    setTimeout(initData, 500);
  }, [userId]);

  // Update elapsed time when clocked in
  useEffect(() => {
    if (attendance?.status === 'ClockedIn' && attendance.clockInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - attendance.clockInTime!.getTime()) / 60000);
        setElapsedMinutes(diff);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedMinutes(0);
    }
  }, [attendance?.status, attendance?.clockInTime]);

  // Profile handlers
  const updateProfile = useCallback((updates: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    setAllProfiles(prev => prev.map(p => p.id === profile.id ? updated : p));
    showMessage('Profile updated successfully!', 'success');
  }, [profile, showMessage]);

  const updateOtherProfile = useCallback((profileId: string, updates: Partial<Profile>) => {
    setAllProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
    showMessage('Employee profile updated!', 'success');
  }, [showMessage]);

  // Attendance handlers
  const handleClockIn = useCallback(() => {
    const now = new Date();
    setAttendance(prev => prev ? {
      ...prev,
      clockInTime: now,
      status: 'ClockedIn',
    } : null);
    showMessage('Clocked in successfully!', 'success');
  }, [showMessage]);

  const handleClockOut = useCallback(() => {
    const now = new Date();
    setAttendance(prev => prev ? {
      ...prev,
      clockOutTime: now,
      status: 'ClockedOut',
    } : null);
    showMessage('Clocked out successfully!', 'success');
  }, [showMessage]);

  // Payment Link Generator handlers
  const handleGenerateLink = useCallback(() => {
    const { customerName, customerEmail, amount, currency, gateway, description } = genState;
    
    // Validation
    if (!customerName.trim()) {
      genDispatch({ type: 'SET_ERROR', error: 'Customer name is required' });
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      genDispatch({ type: 'SET_ERROR', error: 'Valid email is required' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      genDispatch({ type: 'SET_ERROR', error: 'Valid amount is required' });
      return;
    }

    const customerId = `cust_${generateId().slice(0, 8)}`;
    const linkId = generateId().slice(0, 12);
    const generatedLink = `https://pay.example.com/link/${linkId}`;

    const newPaymentLink: PaymentLink = {
      id: generateId(),
      customerId,
      customerName,
      customerEmail,
      amount: parseFloat(amount),
      currency,
      gateway,
      description,
      link: generatedLink,
      createdBy: userId,
      createdByName: profile?.name || 'Unknown',
      createdAt: new Date(),
      status: 'Active',
    };

    setPaymentLinks(prev => [newPaymentLink, ...prev]);
    genDispatch({ type: 'SET_GENERATED_LINK', link: generatedLink });
    showMessage('Payment link generated successfully!', 'success');
  }, [genState, userId, profile?.name, showMessage]);

  return {
    // User & Auth
    userId,
    isLoading,
    
    // Profile
    profile,
    allProfiles,
    updateProfile,
    updateOtherProfile,
    
    // Role checks
    isAdmin,
    isSales,
    
    // Attendance
    attendance,
    elapsedMinutes,
    handleClockIn,
    handleClockOut,
    
    // Payment Links
    paymentLinks,
    genState,
    genDispatch,
    handleGenerateLink,
    
    // Messages
    message,
    showMessage,
  };
}
