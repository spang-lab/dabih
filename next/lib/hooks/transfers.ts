import { create } from "zustand";
import { FileDownload, FileUpload, InodeMembers } from "../api/types";
import { KeyState } from "./key";

interface UploadRequest {
  file: File;
  tag?: string;
  directory?: string;
  filePath?: string;
  chunkSize?: number;
}

export type DownloadStatus =
  | "preparing"
  | "creating"
  | "downloading"
  | "finishing"
  | "canceling"
  | "complete"
  | "error";

export type UploadStatus =
  | "interrupted"
  | "preparing"
  | "uploading"
  | "finishing"
  | "canceling"
  | "complete"
  | "error";

export interface SingleDownload {
  inode: FileDownload;
  aesKey: CryptoKey;
  downloaded: Set<string>;
}

export interface Download {
  id: string;
  type: "download";
  status: DownloadStatus;
  key: KeyState;
  mnemonic: string;
  files?: InodeMembers[];
  downloads?: SingleDownload[];
  error?: string;
}

export interface Upload {
  id: string;
  type: "upload";
  status: UploadStatus;
  file?: File;
  tag?: string;
  directory?: string;
  filePath?: string;
  inode?: FileUpload;
  chunkSize?: number;
  error?: string;
  requiresList?: boolean;
}

export type Transfer = Upload | Download;

interface State {
  transfers: Transfer[];
}

interface Actions {
  addTransfer: (transfer: Transfer) => void;
  upload: (req: UploadRequest) => void;
  download: (mnemonic: string, key: KeyState) => void;
  updateTransfer: (transfer: Transfer) => void;
  clearTransfer: (id: string) => void;
}

const useTransfers = create<State & Actions>((set) => ({
  transfers: [],
  addTransfer: (transfer: Transfer) => {
    set((state) => ({ transfers: [...state.transfers, transfer] }));
  },
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
  download: (mnemonic: string, key: KeyState) => {
    const id = Math.random().toString(36).substring(7);
    const transfer: Transfer = {
      id,
      type: "download",
      status: "preparing",
      key,
      mnemonic,
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
  clearTransfer: (id: string) => {
    set((state) => ({
      transfers: state.transfers.filter((t) => t.id !== id),
    }));
  },
}));

export default useTransfers;
