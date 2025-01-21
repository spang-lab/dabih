import { create } from "zustand";
import { FileUpload } from "../api/types";

interface UploadRequest {
  file: File;
  tag?: string;
  directory?: string;
  filePath?: string;
  chunkSize?: number;
}

export type TransferStatus =
  | "interrupted"
  | "preparing"
  | "uploading"
  | "finishing"
  | "canceling"
  | "complete"
  | "error";

export interface Transfer {
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
  updateTransfer: (transfer: Transfer) => void;
}

const useTransfers = create<State & Actions>((set) => ({
  transfers: [],
  upload: ({ file, tag, directory, filePath, chunkSize }) => {
    const id = Math.random().toString(36).substring(7);
    const transfer: Transfer = {
      id,
      type: "upload",
      status: "preparing",
      file,
      tag,
      directory,
      filePath,
      chunkSize,
    };
    set((state) => ({ transfers: [...state.transfers, transfer] }));
  },
  updateTransfer: (transfer) => {
    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === transfer.id ? transfer : t,
      ),
    }));
  },
}));

export default useTransfers;
