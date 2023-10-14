import { create } from "zustand";

type State = {
  messages: any[];
  notificationLen: number;
};

type Actions = {
  setMessages: (ms: any) => void;
  setNotificationLen: (n: number) => void;
  reset: () => void;
};

const inicialState: State = {
  messages: [] as any[],
  notificationLen: 0,
};

export const useNotification = create<State & Actions>((set) => ({
  ...inicialState,
  setNotificationLen: (n: number) => set((state) => ({ notificationLen: n })),
  setMessages: (ms: any) =>
    set((state) => ({ messages: [...state.messages, ms] })), // Usar el operador spread para crear un nuevo array
  reset: () => {
    set({ notificationLen: 0 });
  },
}));
