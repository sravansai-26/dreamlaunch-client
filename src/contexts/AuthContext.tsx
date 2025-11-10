import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

// --- Interfaces ---
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role?: "general" | "chief";
  avatar?: string;
  bio?: string;
  // --- ADDED: location and website fields ---
  location?: string;
  website?: string;
  // --- END ADDED ---
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  youtubeConnected?: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  authMode: "login" | "register";
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode: "login" | "register") => void;
  closeAuthModal: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// --- Axios Instance ---
// Create a dedicated axios instance to avoid polluting the global defaults.
// This instance is now exported to be used application-wide.
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Interceptor to handle token attachment to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Context Definition ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- AuthProvider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // --- Core Authentication Logic ---
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      console.error("Session check failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // --- API Functions (Wrapped in useCallback for stability) ---
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data.data;

      localStorage.setItem("token", token);
      setUser(userData);
      closeAuthModal(); // Use the memoized function
      toast.success("Welcome back!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user: newUser } = response.data.data;

      localStorage.setItem("token", token);
      setUser(newUser);
      closeAuthModal();
      toast.success("Account created successfully!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await api.put("/auth/profile", userData);
      // The backend should return the updated user object.
      // Make sure the backend returns 'location' and 'website' if updated.
      setUser(response.data.data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      throw error;
    }
  }, []);

  // --- Modal Control Functions (Wrapped in useCallback) ---
  const openAuthModal = useCallback((mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // --- Context Value ---
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    showAuthModal,
    authMode,
    login,
    register,
    logout,
    openAuthModal,
    closeAuthModal,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
  );
};