export type UserRole = 'super_admin' | 'employee';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  createdBy?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  designation: string;
}
