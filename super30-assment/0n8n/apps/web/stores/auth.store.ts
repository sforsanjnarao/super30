import { create } from 'zustand';
// Define the shape of your user object
interface User {
    id: string;
    name: string;
    email: string;
}
// Define the shape of the store's state
interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

