import { Transfer, TransferStatus } from "@/lib/hooks/transfers";

import api from "./api";
import crypto from "./crypto";
import { FileUpload } from "./api/types";

function toError(transfer: Transfer, message: Error | string) {
  if (typeof message !== "string") {
    message = message.message;
  }
  return {
    ...transfer,
    status: "error" as TransferStatus,
    error: message,
  };
}
function invalidStateError(transfer: Transfer) {
  return toError(transfer, "Invalid transfer state");
}

async function handleUpload(transfer: Transfer) {
  switch (transfer.status) {
    case "preparing": {
      const { file } = transfer;
      if (!file) {
        return invalidStateError(transfer);
      }
      const { data: inode, error } = await api.upload.start({
        fileName: file.name,
        directory: transfer.directory,
        filePath: transfer.filePath,
        size: file.size,
        tag: transfer.tag,
      });
      if (!inode || error) {
        return toError(transfer, error || "Failed to start upload");
      }
      return {
        ...transfer,
        status: "uploading" as TransferStatus,
        inode: {
          ...inode,
          data: {
            ...inode.data,
            chunks: [],
          },
        },
      };
    }
    case "uploading": {
      const { inode, file } = transfer;
      if (!inode || !file) {
        return invalidStateError(transfer);
      }
      const { chunks } = inode.data;
      let start = 0;
      if (chunks.length) {
        const { end } = chunks.at(-1)!;
        start = parseInt(end as string) + 1;
        if (isNaN(start)) {
          return toError(transfer, "Failed to parse chunk end");
        }
      }
      if (start === file.size) {
        return {
          ...transfer,
          status: "finishing" as TransferStatus,
        };
      }
      const twoMiB = 2 * 1024 * 1024;
      const chunkSize = transfer.chunkSize ?? twoMiB;
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
        return toError(transfer, error || "Failed to upload chunk");
      }
      return {
        ...transfer,
        inode: {
          ...inode,
          data: {
            ...inode.data,
            chunks: [...chunks, chunk],
          },
        },
      };
    }
    case "finishing": {
      const { inode } = transfer;
      if (!inode) {
        return invalidStateError(transfer);
      }
      const { chunks } = inode.data;
      const buffers = chunks.map((chunk) =>
        crypto.base64url.toUint8(chunk.hash),
      );
      const merged = await new Blob([...buffers]).arrayBuffer();
      const hash = await crypto.hash(merged);
      const { data: result, error } = await api.upload.finish(inode.mnemonic);
      if (!result || error) {
        return toError(transfer, error || "Failed to finish upload");
      }
      if (result.data.hash !== hash) {
        return toError(
          transfer,
          `Hash mismatch: ${result.data.hash} !== ${hash}`,
        );
      }
      return {
        ...transfer,
        status: "complete" as TransferStatus,
        inode: result as FileUpload,
        file: undefined,
      };
    }
    case "canceling": {
      return transfer;
    }
    default:
      return invalidStateError(transfer);
  }
}

export default async function handleTransfer(
  transfer: Transfer,
): Promise<Transfer> {
  if (transfer.type === "upload") {
    return handleUpload(transfer);
  }
  throw new Error(`Unsupported transfer type: ${transfer.type}`);
}
