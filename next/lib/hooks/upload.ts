"use client";

import { useCallback, useEffect, useState } from "react";
import api from "../api";
import crypto from "../crypto";
import { FileUpload } from "../api/types";

interface Options {
  tag?: string;
  directory?: string;
  filePath?: string;
  chunkSize: number;
}

export interface UploadState {
  status:
  | "loading"
  | "ready"
  | "interrupted"
  | "preparing"
  | "uploading"
  | "finishing"
  | "canceling"
  | "complete"
  | "error";
  file?: File;
  options: Options;
  inode?: FileUpload;
  error?: string;
}

export default function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: "loading",
    options: {
      chunkSize: 2 * 1024 * 1024,
    },
  });
  const update = useCallback(async () => {
    const { status, options, file, inode } = state;
    switch (status) {
      case "loading": {
        const { data: incomlete } = await api.upload.unfinished();
        if (incomlete?.length) {
          if (incomlete.length > 1) {
            setState({
              status: "error",
              options,
              error: "Multiple incomplete uploads",
            });
            return;
          }
          setState({
            status: "interrupted",
            options,
            inode: incomlete[0],
          });
          return;
        }
        setState({ status: "ready", options });
        return;
      }
      case "ready": {
        return;
      }
      case "interrupted": {
        return;
      }
      case "preparing": {
        if (!file) {
          return;
        }
        if (inode?.data.fileName === file.name) {
          setState({
            status: "uploading",
            inode: state.inode,
            options: state.options,
            file,
          });
          return;
        }
        const { options } = state;
        const { data: upload, error } = await api.upload.start({
          fileName: file.name,
          directory: options?.directory,
          filePath: options?.filePath,
          size: file.size,
          tag: options?.tag,
        });
        if (!upload || error) {
          setState({
            status: "error",
            options,
            error: error || "Failed to start upload",
          });
          return;
        }
        setState({
          status: "uploading",
          inode: {
            ...upload,
            data: {
              ...upload.data,
              chunks: [],
            },
          },
          options,
          file,
        });
        return;
      }
      case "uploading": {
        if (!inode || !file) {
          return;
        }
        const { chunks } = inode.data;
        let start = 0;
        if (chunks.length) {
          console.log(chunks);
          const { end } = chunks.at(-1)!;
          console.log(end);
          start = parseInt(end as string) + 1;
          if (isNaN(start)) {
            setState({
              status: "error",
              options,
              error: "Failed to parse chunk end",
            });
            return;
          }
        }
        if (start === file.size) {
          setState({
            inode,
            file,
            options,
            status: "finishing",
          });
          return;
        }
        const twoMiB = 2 * 1024 * 1024;
        const chunkSize = options?.chunkSize ?? twoMiB;
        const blob = file.slice(start, start + chunkSize);
        const hash = await crypto.hash(await blob.arrayBuffer());

        const { data: chunk, error } = await api.upload.chunk({
          mnemonic: inode.mnemonic,
          hash,
          start: start,
          end: start + blob.size - 1,
          data: blob,
        });
        if (!chunk || error) {
          setState({
            status: "error",
            options,
            error: error || "Failed to upload chunk",
          });
          return;
        }
        setState({
          status: "uploading",
          options: state.options,
          inode: {
            ...inode,
            data: {
              ...inode.data,
              chunks: [...chunks, chunk],
            },
          },
          file,
        });
        return;
      }
      case "finishing": {
        if (!inode) {
          return;
        }
        const { chunks } = inode.data;
        const buffers = chunks.map((chunk) =>
          crypto.base64url.toUint8(chunk.hash),
        );
        const merged = await new Blob([...buffers]).arrayBuffer();
        const hash = await crypto.hash(merged);

        const { data: result, error } = await api.upload.finish(inode.mnemonic);
        if (!result || error) {
          setState({
            status: "error",
            options,
            error: error || "Failed to finish upload",
          });
          return;
        }
        if (result.data.hash !== hash) {
          setState({
            status: "error",
            options,
            error: `Upload failed: hash mismatch server:${result.data.hash} client:${hash}`,
          });
          return;
        }
        setState({
          status: "complete",
          options,
          inode,
        });
        return;
      }
      case "canceling": {
        if (!inode) {
          return;
        }
        const { error } = await api.upload.cancel(inode.mnemonic);
        if (error) {
          setState({
            status: "error",
            options,
            error: error ?? "Failed to cancel upload",
          });
          return;
        }
        setState({
          status: "loading",
          options,
        });
        return;
      }
      case "complete": {
        return;
      }
      case "error": {
        return;
      }
      default:
        throw new Error(`Impossible state: ${status as string}`);
    }
  }, [state]);

  useEffect(() => {
    update().catch(console.error);
  }, [update]);

  return {
    state,
    start: (file: File, options?: Options) => {
      const defaultOptions = {
        chunkSize: 2 * 1024 * 1024,
      };

      if (state.status === "interrupted") {
        setState({
          status: "preparing",
          inode: state.inode,
          file,
          options: options ?? defaultOptions,
        });
        return;
      }
      setState({
        status: "preparing",
        file,
        options: options ?? defaultOptions,
      });
    },
    cancel: () => {
      setState({
        ...state,
        status: "canceling",
      });
    },
    clearError: () => {
      setState({
        status: "loading",
        options: state.options,
      });
    },
  };
}
