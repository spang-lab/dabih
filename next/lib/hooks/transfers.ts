import { create } from "zustand";
import { FileUpload } from "../api/types";

interface UploadRequest {
  file: File;
  tag?: string;
  directory?: string;
  filePath?: string;
  chunkSize?: number;
}

type TransferStatus =
  | "loading"
  | "ready"
  | "interrupted"
  | "preparing"
  | "uploading"
  | "finishing"
  | "canceling"
  | "complete"
  | "error";

interface Transfer {
  id: string;
  type: "upload" | "download";
  status: TransferStatus;
  file?: File;
  tag?: string;
  directory?: string;
  filePath?: string;
  chunkSize?: number;
  inode?: FileUpload;
  error?: string;
}

interface State {
  transfers: Transfer[];
}

interface Actions {
  upload: (req: UploadRequest) => void;
  addTransfer: (transfer: Transfer) => void;
  removeTransfer: (transfer: Transfer) => void;
}

const useTransfers = create<State & Actions>((set) => ({
  transfers: [],
  upload: ({ file, tag, directory, filePath, chunkSize }) => {
    const id = Math.random().toString(36).substring(7);
    const transfer: Transfer = {
      id,
      type: "upload",
      status: "loading",
      file,
      tag,
      directory,
      filePath,
      chunkSize,
    };
    set((state) => ({ transfers: [...state.transfers, transfer] }));
  },
  addTransfer: (transfer) =>
    set((state) => ({ transfers: [...state.transfers, transfer] })),
  removeTransfer: (transfer) =>
    set((state) => ({
      transfers: state.transfers.filter((t) => t !== transfer),
    })),
}));

export default useTransfers;
