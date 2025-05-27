
import api from "@/lib/api";
import { FileKeys, InodeMembers, InodeType } from "@/lib/api/types";
import { useState, useEffect, useMemo } from "react";
import { Bytes, LocalDate } from "@/app/util";
import ListItem from "./ListItem";
import Icon from "../inode/Icon";
import FileName from "../inode/Filename";
import { Copy } from "react-feather";

const getKind = (type: InodeType) => {
  switch (type) {
    case InodeType.DIRECTORY:
      return "Folder";
    case InodeType.FILE:
      return "File";
    case InodeType.TRASH:
      return "Bin";
    case InodeType.UPLOAD:
      return "Upload";
  }
};


function FileInfo({ inode }: { inode: InodeMembers }) {
  const { data } = inode;
  if (!data) {
    return null;
  }
  const size = parseInt(data.size as string, 10);
  const { hash, uid, fileName, filePath } = data;
  const copyHash = () => { navigator.clipboard.writeText(hash!).catch(console.error) };
  return (
    <>
      <ListItem label="Size">
        <Bytes value={size} />
        {' '}
        (
        <Bytes binary value={size} />
        )
      </ListItem>
      <ListItem label="Storage ID">
        <span className="font-mono text-sm">
          {uid}
        </span>
      </ListItem>
      <ListItem label="Checksum (SHA-256)">
        <div className="flex items-center">
          <textarea
            wrap="hard"
            className="break-all font-mono text-xs bg-gray-100 rounded-lg px-2 py-1"
            value={hash ?? ""} cols={20} rows={2} readOnly />
          <button
            type="button"
            className="ml-2 px-2 py-1 border border-gray-700 text-gray-600 rounded-lg hover:bg-gray-200"
            aria-label="Copy Hash"
            onClick={copyHash}
          >
            <Copy size={18} />
          </button>
        </div>
      </ListItem>
      <ListItem hidden={fileName === inode.name} label="Original Name">
        <FileName fileName={fileName} />
      </ListItem>
      <ListItem hidden={!filePath} label="Original Path">
        <FileName fileName={filePath ?? ""} />
      </ListItem>
    </>
  )

}




export default function InodeInfo({ inode }: { inode: InodeMembers }) {
  const [files, setFiles] = useState<FileKeys[]>([]);
  const { name, type, mnemonic } = inode;
  const isDir = [InodeType.DIRECTORY, InodeType.TRASH].includes(type);

  useEffect(() => {
    const list = async () => {
      if (!isDir) {
        return;
      }
      const { data } = await api.fs.listFiles(inode.mnemonic);
      if (!data) {
        return;
      }
      setFiles(data);
    };
    list().catch(console.error);
  }, [inode]);


  const totalSize = useMemo(() => {
    return files.reduce((acc, file) => acc + parseInt(file.data.size as string, 10), 0);
  }, [files]);


  return (
    <div className="px-3">
      <dl className="divide-y divide-gray-200">
        <div className="grid gap-4 grid-cols-3 py-2 items-center">
          <dt
            className="text-sm font-medium leading-6 flex justify-center"
          >
            <Icon inode={inode} />
          </dt>
          <dd className="col-span-2 leading-6">
            <h3 className="text-lg font-medium leading-6 text-blue">
              {getKind(type)}
            </h3>
            <FileName fileName={name} />
          </dd>
        </div>
        <ListItem label="ID">
          <span className="font-mono">
            {mnemonic}
          </span>
        </ListItem>


        <ListItem hidden={!isDir} label="Files">
          {files.length}
        </ListItem>
        <ListItem hidden={!isDir} label="Total Size">
          <Bytes value={totalSize} />
          {' '}
          (
          <Bytes binary value={totalSize} />
          )
        </ListItem>
        <FileInfo inode={inode} />
        <ListItem label="Created">
          <span className="text-sm text-gray-700">
            <LocalDate showTime value={inode.createdAt} />
          </span>
        </ListItem>
        <ListItem label="Last Modified">
          <span className="text-sm text-gray-700">
            <LocalDate showTime value={inode.updatedAt} />
          </span>
        </ListItem>
      </dl>
    </div>
  );

}
