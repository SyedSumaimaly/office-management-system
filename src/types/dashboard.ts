import { Designation } from '@/utils/constants';

export interface Profile {
  id: string;
  name: string;
  email: string;
  designation: Designation;
  avatarUrl?: string;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockInTime: Date | null;
  clockOutTime: Date | null;
  status: 'ClockedIn' | 'ClockedOut';
}

export interface PaymentLink {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  gateway: string;
  description: string;
  link: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  status: 'Active' | 'Paid' | 'Expired';
}

export interface Message {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}
