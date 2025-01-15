export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isOnGard: boolean;
  image?: string;
  
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}