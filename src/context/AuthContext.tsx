
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would check localStorage/sessionStorage
    // and validate the token with your backend
    const storedUser = localStorage.getItem("canteenUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would be an API call
      // This is just for demo purposes
      const mockUsers = [
        {
          id: "1",
          email: "student@example.com",
          password: "password",
          name: "John Student",
          role: "student" as UserRole,
        },
        {
          id: "2",
          email: "manager@example.com",
          password: "password",
          name: "Mary Manager",
          role: "canteen_manager" as UserRole,
        },
      ];
      
      const user = mockUsers.find(user => user.email === email && user.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem("canteenUser", JSON.stringify(userWithoutPassword));
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock registration - in a real app, this would be an API call
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role
      };
      setCurrentUser(newUser);
      localStorage.setItem("canteenUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("canteenUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
