import { create } from 'zustand';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastState {
    open: boolean;
    message: string;
    type: ToastType;
    show: (message: string, type?: ToastType) => void;
    hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
    open: false,
    message: '',
    type: 'success',

    show: (message, type = 'success') =>
        set({ open: true, message, type }),

    hide: () => set({ open: false }),
}));