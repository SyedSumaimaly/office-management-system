import { useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginCredentials, CreateEmployeeData, UserRole } from '@/types/auth';
import { generateId } from '@/utils/constants';

const AUTH_STORAGE_KEY = 'office_dashboard_auth';
const USERS_STORAGE_KEY = 'office_dashboard_users';

// Default super admin
const DEFAULT_SUPER_ADMIN: AuthUser & { password: string } = {
  id: 'super_admin_001',
  email: 'admin@company.com',
  password: 'admin123',
  name: 'Super Admin',
  role: 'super_admin',
  createdAt: new Date(),
};

function getStoredUsers(): (AuthUser & { password: string; designation?: string })[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    const users = JSON.parse(stored);
    return users.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt) }));
  }
  return [DEFAULT_SUPER_ADMIN];
}

function saveUsers(users: (AuthUser & { password: string; designation?: string })[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({ ...parsed, createdAt: new Date(parsed.createdAt) });
    }
    setIsLoading(false);
  }, []);

  const loginSuperAdmin = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.email === credentials.email && u.password === credentials.password && u.role === 'super_admin'
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials or not a Super Admin' };
  }, []);

  const loginEmployee = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.email === credentials.email && u.password === credentials.password && u.role === 'employee'
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials or account not found' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const createEmployee = useCallback(async (data: CreateEmployeeData): Promise<{ success: boolean; error?: string; employee?: AuthUser }> => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === data.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newEmployee: AuthUser & { password: string; designation: string } = {
      id: `emp_${generateId().slice(0, 8)}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'employee',
      designation: data.designation,
      createdAt: new Date(),
      createdBy: user?.id,
    };

    users.push(newEmployee);
    saveUsers(users);

    const { password, ...employeeWithoutPassword } = newEmployee;
    return { success: true, employee: employeeWithoutPassword };
  }, [user?.id]);

  const getEmployees = useCallback((): (AuthUser & { designation?: string })[] => {
    const users = getStoredUsers();
    return users
      .filter(u => u.role === 'employee')
      .map(({ password, ...rest }) => rest);
  }, []);

  const deleteEmployee = useCallback((employeeId: string): boolean => {
    const users = getStoredUsers();
    const filtered = users.filter(u => u.id !== employeeId);
    if (filtered.length < users.length) {
      saveUsers(filtered);
      return true;
    }
    return false;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isEmployee: user?.role === 'employee',
    loginSuperAdmin,
    loginEmployee,
    logout,
    createEmployee,
    getEmployees,
    deleteEmployee,
  };
}
