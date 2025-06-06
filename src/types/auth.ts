
import { User } from '@/lib/types';
import { Session } from '@supabase/supabase-js';

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
