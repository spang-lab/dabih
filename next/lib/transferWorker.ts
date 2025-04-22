import {
  Download,
  DownloadStatus,
  Transfer,
  UploadStatus,
  Upload,
} from "@/lib/hooks/transfers";

import api from "./api";
import crypto from "./crypto";
import {
  FileUpload,
  InodeMembersParent,
  InodeTree,
  InodeType,
  InodeMembers,
} from "./api/types";

function toError(transfer: Transfer, message: Error | string) {
  if (typeof message !== "string") {
    message = message.message;
  }
  if (transfer.type === "upload") {
    return {
      ...transfer,
      status: "error" as UploadStatus,
      error: message,
    };
  }
  return {
    ...transfer,
    status: "error" as DownloadStatus,
    error: message,
  };
}
function invalidStateError(transfer: Transfer) {
  return toError(transfer, `Invalid transfer state ${transfer.status}`);
}

async function handleUpload(transfer: Upload) {
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
        status: "uploading" as UploadStatus,
        requiresList: true,
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
          status: "finishing" as UploadStatus,
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
        requiresList: false,
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
        status: "complete" as UploadStatus,
        inode: result as FileUpload,
        file: undefined,
        requiresList: true,
      };
    }
    case "canceling": {
      throw new Error("Not implemented");
    }
    default:
      return invalidStateError(transfer);
  }
}

const handles = new Map<string, FileSystemHandle>();

async function createHandles(
  node: InodeTree,
  parentHandle: FileSystemDirectoryHandle,
): Promise<InodeMembers[]> {
  if (node.type === InodeType.FILE) {
    const { name, mnemonic } = node;
    const handle = await parentHandle.getFileHandle(name, { create: true });
    handles.set(mnemonic, handle);
    return [node];
  }
  if (node.children) {
    const { name, mnemonic } = node;
    const handle = await parentHandle.getDirectoryHandle(name, {
      create: true,
    });
    handles.set(mnemonic, handle);
    const nodes: InodeMembers[] = [];
    for (const child of node.children) {
      const newNodes = await createHandles(child, handle);
      nodes.push(...newNodes);
    }
    return nodes;
  }
  return [];
}

async function handleDownload(transfer: Download) {
  switch (transfer.status) {
    case "preparing": {
      const { data: tree, error } = await api.fs.tree(transfer.mnemonic);
      if (!tree || error) {
        return toError(
          transfer,
          `Failed to list tree for ${transfer.mnemonic}`,
        );
      }
      const rootHandle = await navigator.storage.getDirectory();
      const files = await createHandles(tree, rootHandle);
      return {
        ...transfer,
        status: "creating" as DownloadStatus,
        files,
        downloads: [],
      };
    }
    case "creating": {
      const { files, downloads, key } = transfer;
      if (key.status !== "active" || !key.key) {
        return toError(transfer, "Pivate key is not valid");
      }
      if (!files || !downloads) {
        return invalidStateError(transfer);
      }
      const nextFile = files.shift();
      if (!nextFile) {
        return {
          ...transfer,
          status: "finishing" as DownloadStatus,
        };
      }
      const { data: inode, error } = await api.fs.file(nextFile.mnemonic);
      if (!inode || error) {
        return toError(transfer, error ?? "Failed to get inode");
      }
      const aesKey = await crypto.file.decryptKey(key.key, inode);
      const download = {
        inode,
        aesKey,
        downloaded: new Set<string>(),
      };
      return {
        ...transfer,
        status: "downloading" as DownloadStatus,
        files,
        downloads: [...downloads, download],
      };
    }
    case "downloading": {
      const { downloads } = transfer;
      if (!downloads) {
        return invalidStateError(transfer);
      }
      const download = downloads.pop();
      if (!download) {
        return invalidStateError(transfer);
      }
      const { aesKey, inode, downloaded } = download;
      const handle = handles.get(inode.mnemonic) as FileSystemFileHandle;
      const accessHandle = await handle.createSyncAccessHandle();
      const { chunks, uid } = inode.data;
      const chunk = chunks.find((c) => !downloaded.has(c.hash));
      if (!chunk) {
        return {
          ...transfer,
          downloads: [...downloads, download],
          status: "creating" as DownloadStatus,
        };
      }

      const { data: encrypted, error } = await api.download.chunkBuf(
        uid,
        chunk.hash,
      );
      if (!encrypted || error) {
        return toError(transfer, error ?? "Failed to get chunk");
      }
      const decrypted = await crypto.aesKey.decrypt(
        aesKey,
        chunk.iv,
        encrypted,
      );
      const hash = await crypto.hash(decrypted);
      if (hash !== chunk.hash) {
        return toError(
          transfer,
          `Hash mismatch. Downloaded: ${hash} !== Server: ${chunk.hash}`,
        );
      }
      const offset = parseInt(chunk.start as string, 10);
      accessHandle.write(decrypted, { at: offset });
      downloaded.add(chunk.hash);
      accessHandle.close();

      return {
        ...transfer,
        status: "downloading" as DownloadStatus,
        downloads: [
          ...downloads,
          {
            ...download,
            downloaded,
          },
        ],
      };
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
  if (transfer.type === "download") {
    return handleDownload(transfer);
  }
  throw new Error(`Unsupported transfer type`);
}

self.onmessage = async (event: MessageEvent<Transfer>) => {
  const transfer = event.data;
  if (!transfer) {
    return;
  }
  const result = await handleTransfer(transfer);
  self.postMessage(result);
};
