import { create } from "zustand";

type State = {
  messages: any[];
};

type Actions = {
  setMessages: (ms: any) => void;
};

export const useNotification = create<State & Actions>((set) => ({
  messages: [] as any[],
  setMessages: (ms: any) =>
    set((state) => ({ messages: [...state.messages, ms] })), // Usar el operador spread para crear un nuevo array
}));
