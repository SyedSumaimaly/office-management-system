import { useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginCredentials, CreateEmployeeData, UserRole } from '@/types/auth';
import { generateId } from '@/utils/constants';
import { API_BASE_URL } from "@/config/api";
import axios from 'axios';


const AUTH_STORAGE_KEY = 'office_dashboard_auth';
const USERS_STORAGE_KEY = 'office_dashboard_users';


export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from local storage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({ ...parsed, createdAt: new Date(parsed.createdAt) });
    }
    setIsLoading(false);
  }, []);


  // ---------------------------------------------
  // ⭐ SUPER ADMIN LOGIN (Connects to backend)
  // ---------------------------------------------
  const loginSuperAdmin = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin/login`, credentials);

      if (res.status === 200 && res.data.user && res.data.token) {
        const user = {
          id: res.data.user._id,               // FIX HERE
          name: res.data.user.name,
          email: res.data.user.email,
          role: "super_admin",
          createdAt: res.data.user.createdAt
        };

        const token = res.data.token;

        setUser(user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem("adminToken", token);

        return { success: true };
      } else {
        return { success: false, error: "Login failed: Invalid response from server" };
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      return { success: false, error: errorMsg };
    }
  }, []);





  // ---------------------------------------------
  // ⭐ EMPLOYEE LOGIN (NOT IMPLEMENTED IN BACKEND)
  // Keep as placeholder until backend created
  // ---------------------------------------------
  const loginEmployee = useCallback(
    async ({ email, password }): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/employees/login', {
          email,
          password,
        });

        const { token, user: backendUser } = response.data;

        // 1. Format the user object to match your AuthUser type
        const authUser = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role, // This should be "employee" from your backend
          designation: backendUser.designation,
          createdAt: new Date().toISOString() // or backendUser.createdAt
        };

        // 2. Update React State (This triggers the Dashboard change!)
        setUser(authUser);

        // 3. Save to LocalStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        localStorage.setItem('token', token);

        return { success: true };
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || "Cannot connect to backend server.";
        return { success: false, error: errorMessage };
      }
    },
    [setUser] // Add setUser to dependencies
  );
  // ---------------------------------------------
  // ⭐ LOGOUT
  // ---------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("adminToken");
  }, []);

  // ---------------------------------------------
  // ⭐ CREATE EMPLOYEE (Backend)
  // ---------------------------------------------
  const createEmployee = useCallback(
    async (
      data: CreateEmployeeData
    ): Promise<{ success: boolean; error?: string; employee?: AuthUser }> => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorResult = await res.json();

          return {
            success: false,
            error: errorResult.error || `Server responded with status ${res.status}`
          };
        }

        const result = await res.json();

        if (!result.user && !result.employee) {
          return { success: false, error: "Successful response but employee data is missing." };
        }

        return {
          success: true,
          employee: result.user || result.employee,
        };
      } catch (err) {
        console.error("Fetch/Network Error:", err);
        return { success: false, error: "Network error or server unreachable." };
      }
    },
    []
  );

  // ---------------------------------------------
  // ⭐ GET EMPLOYEES (Backend)
  // ---------------------------------------------
  const getEmployees = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Handle error status (e.g., 401, 403)
        const errorData = await res.json();
        console.error("Failed to fetch employees:", errorData);
        return []; // Return empty array on failure
      }

      const result = await res.json();
      // Assume the backend returns the array directly or under a 'employees' key
      return result.employees || result;
    } catch (err) {
      console.error("Network error fetching employees:", err);
      return []; // Return empty array on network failure
    }
  };
  // ---------------------------------------------
  // ⭐ DELETE EMPLOYEE (Backend)
  // ---------------------------------------------
  const deleteEmployee = useCallback(async (employeeId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const result = await res.json();
      return result.success;
    } catch {
      return false;
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "super_admin",
    isEmployee: user?.role === "employee",

    loginSuperAdmin,
    loginEmployee,
    logout,
    createEmployee,
    getEmployees,
    deleteEmployee,
  };
}
