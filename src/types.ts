export interface AuthUser {
  name: string;
  email: string;
  roles: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}
