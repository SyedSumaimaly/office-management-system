export const DESIGNATIONS = [
  'Fornt Seller',
  'Upseller',
  'General Staff',
  'Graphic Designer',
  'Marketer',
  'Developer',
  'Admin',
  'Manager',
  'HR',
] as const;

export const ADMIN_ROLES = ['Admin', 'Manager'] as const;
export const SALES_ROLES = ['Upseller', 'Fornt Seller'] as const;

export const GATEWAYS = [
  { id: 'stripe', name: 'Stripe', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'razorpay', name: 'Razorpay', icon: '💰' },
] as const;

export type Designation = typeof DESIGNATIONS[number];
export type Gateway = typeof GATEWAYS[number];

export const formatTime = (date: Date | null): string => {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const getTodayKey = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
