
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/lib/types';
import { users } from '@/lib/mockData';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistent auth)
    const storedUser = localStorage.getItem('marketplace_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('marketplace_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to validate credentials
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, we'd verify password here
        if (password.length > 0) { // Mock validation
          setUser(foundUser);
          setIsAuthenticated(true);
          localStorage.setItem('marketplace_user', JSON.stringify(foundUser));
          toast({
            title: "Logged in successfully",
            description: `Welcome back, ${foundUser.name}!`,
          });
        } else {
          setError('Invalid password');
          toast({
            title: "Login failed",
            description: "Invalid password",
            variant: "destructive",
          });
        }
      } else {
        setError('User not found');
        toast({
          title: "Login failed",
          description: "User not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to register the user
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        setError('Email already in use');
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
      } else if (password.length < 6) {
        setError('Password must be at least 6 characters');
        toast({
          title: "Registration failed",
          description: "Password must be at least 6 characters",
          variant: "destructive",
        });
      } else {
        // Create a new mock user
        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          createdAt: new Date().toISOString(),
          role: 'user',
        };
        
        // In a real app, this would update the database
        // For now, we'll just act as if the user was created successfully
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('marketplace_user', JSON.stringify(newUser));
        toast({
          title: "Registration successful",
          description: `Welcome, ${name}!`,
        });
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('marketplace_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      error, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
