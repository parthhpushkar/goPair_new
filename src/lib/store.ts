import { create } from 'zustand';

interface SearchState {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setDate: (date: string) => void;
  setPassengers: (passengers: number) => void;
  swapLocations: () => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  origin: '',
  destination: '',
  date: '',
  passengers: 1,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDate: (date) => set({ date }),
  setPassengers: (passengers) => set({ passengers }),
  swapLocations: () =>
    set((state) => ({
      origin: state.destination,
      destination: state.origin,
    })),
  reset: () => set({ origin: '', destination: '', date: '', passengers: 1 }),
}));

interface UIState {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
