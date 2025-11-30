import { User } from "@/types/medical";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { saveUser, getUserByEmail, getUser } from "./firebaseService";
import {
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
  try {
    // Validate password
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Check if Firebase is available
    if (auth) {
      // Use Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user profile
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Save user to Firestore
      await saveUser(user);

      // Store in localStorage for compatibility
      setCurrentUser(user);
      const token = await firebaseUser.getIdToken();
      setToken(token);

      return { success: true, user, token };
    } else {
      // Fallback to localStorage (if Firebase not configured)
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: "User with this email already exists" };
      }

      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      await saveUser(user);
      const token = generateToken(user.id, user.email);
      setToken(token);
      setCurrentUser(user);

      return { success: true, user, token };
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message || "Failed to create account. Please try again.",
    };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Check if Firebase is available
    if (auth) {
      // Use Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore
      let user = await getUser(firebaseUser.uid);
      if (!user) {
        // Create user profile if it doesn't exist
        user = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name: firebaseUser.displayName || email.split("@")[0],
          createdAt: new Date().toISOString(),
        };
        await saveUser(user);
      }

      // Store in localStorage for compatibility
      setCurrentUser(user);
      const token = await firebaseUser.getIdToken();
      setToken(token);

      return { success: true, user, token };
    } else {
      // Fallback to localStorage (if Firebase not configured)
      const user = await getUserByEmail(email);
      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }

      if (!password || password.length < 6) {
        return { success: false, error: "Invalid email or password" };
      }

      const token = generateToken(user.id, user.email);
      setToken(token);
      setCurrentUser(user);

      return { success: true, user, token };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || "Invalid email or password",
    };
  }
};

export const logout = async (): Promise<void> => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  clearAuth();
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  if (auth?.currentUser) return true;
  const token = getToken();
  if (!token) return false;
  return verifyToken(token);
};

export const getAuthUser = (): User | null => {
  return getCurrentUser();
};

