import { create } from "zustand";

interface State {
  transfers: string[];
}

interface Actions {
  addTransfer: (transfer: string) => void;
  removeTransfer: (transfer: string) => void;
}

const useTransfers = create<State & Actions>((set) => ({
  transfers: [],
  addTransfer: (transfer) =>
    set((state) => ({ transfers: [...state.transfers, transfer] })),
  removeTransfer: (transfer) =>
    set((state) => ({
      transfers: state.transfers.filter((t) => t !== transfer),
    })),
}));

export default useTransfers;
