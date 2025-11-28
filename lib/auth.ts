import { User } from "@/types/medical";
import {
  saveUser,
  getUserByEmail,
  setCurrentUser,
  getCurrentUser,
  setToken,
  getToken,
  clearAuth,
} from "@/lib/storage";

// Simple token generation (for demo purposes)
// In production, use proper JWT with a backend
const generateToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
};

const verifyToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp && payload.exp > Date.now()) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return { success: false, error: "User with this email already exists" };
  }

  // Validate password (simple check)
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  // Create user
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  // Save user (in a real app, you'd save the hashed password to a database)
  // For simplicity, we'll just save the user without password in localStorage
  saveUser(user);

  // Generate token
  const token = generateToken(user.id, user.email);

  setToken(token);
  setCurrentUser(user);

  return { success: true, user, token };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // In a real app, you'd verify the password against the hashed password in the database
  // For this simple version, we'll just check if user exists
  // In production, you'd do: const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!password || password.length < 6) {
    return { success: false, error: "Invalid email or password" };
  }

  // Generate token
  const token = generateToken(user.id, user.email);

  setToken(token);
  setCurrentUser(user);

  return { success: true, user, token };
};

export const logout = (): void => {
  clearAuth();
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = getToken();
  if (!token) return false;
  return verifyToken(token);
};

export const getAuthUser = (): User | null => {
  return getCurrentUser();
};

