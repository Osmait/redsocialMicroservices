import { create } from "zustand";

type State = {
  messages: any[];
  notificationLen: number;
  user: null | {};
};

type Actions = {
  setMessages: (ms: any) => void;
  setUser: (u: any) => void;
  setNotificationLen: (n: number) => void;
  reset: () => void;
};
// const token = localStorage.getItem("x-token");

const inicialState: State = {
  messages: [] as any[],
  notificationLen: 0,
  user: null,
};

export const useNotification = create<State & Actions>((set) => ({
  ...inicialState,
  setNotificationLen: (n: number) => set((state) => ({ notificationLen: n })),
  setUser: (u: any) => set((state) => ({ user: u })),
  setMessages: (ms: any) =>
    set((state) => ({ messages: [...state.messages, ms] })), // Usar el operador spread para crear un nuevo array
  reset: () => {
    set({ notificationLen: 0 });
  },
}));
//
