import api from "@/lib/api";
import { FileData, IntegrityCheckResult } from "@/lib/api/types";
import useSession from "@/Session";
import { Bytes } from "@/util";
import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "react-feather";



function OrphanedFile({ data, onRemove }: {
  data: FileData,
  onRemove: (uid: string) => void
}
) {
  const { uid, hash, size, fileName } = data;
  const s = parseInt(size as string, 10);

  return (
    <div key={uid} className="p-1 text-sm border border-gray-300 rounded">
      <div className="flex justify-between">
        <span className="font-bold text-blue mr-2">{fileName}</span>
        <Bytes value={s} />
        <button
          type="button"
          onClick={() => onRemove(uid)}
          className="text-white bg-red px-2 py-1 rounded text-xs"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div>
        <span className="font-mono text-[10px]">{hash}</span>
      </div>
    </div>
  )
}


function Integrity({ data }: { data: IntegrityCheckResult | null }) {
  if (!data) {
    return <div>Loading...</div>;
  }
  const { missing, unknown } = data;
  if (missing.length === 0 && unknown.length === 0) {
    return <div className="text-green font-bold">All files are consistent.</div>;
  }
  if (missing.length > 0) {
    return (
      <div className="bg-red/70 p-2 rounded text-gray-200 text-xs">
        <h4 className="font-bold text-lg text-white">Missing Files</h4>
        <p className="text-xs"> The following files are referenced by inodes but are missing from the storage backend:</p>
        <ul className="list-none flex gap-2 flex-wrap text-white">
          {missing.map((m) => (
            <li className="text-xs font-mono" key={m}>{m}</li>
          ))}
        </ul>
        <p className="font-bold text-red bg-white rounded px-2 py-1 text-center text-lg mt-2">
          THIS IS A SERIOUS ISSUE AND SHOULD BE INVESTIGATED IMMEDIATELY.
        </p>
      </div>
    );
  }
  if (unknown.length > 0) {
    return (
      <div className="bg-orange/70 p-2 rounded text-gray-200 text-xs">
        <h4 className="font-bold text-lg text-white">Unknown Buckets</h4>
        <p className="text-xs"> The following buckets exist but are not referenced by any file data:</p>
        <ul className="list-none flex gap-2 flex-wrap text-white">
          {unknown.map((u) => (
            <li className="text-xs font-mono" key={u}>{u}</li>
          ))}
        </ul>
        These can be safely deleted from the storage backend.
      </div>
    );
  }



  return (
    "OK"
  );

}



export default function FileData() {
  const { isAdmin } = useSession();
  const [orphans, setOrphans] = useState<FileData[]>([]);
  const [integrity, setIntegrity] = useState<IntegrityCheckResult | null>(null);

  const fetchOrphans = useCallback(async () => {
    if (!isAdmin) {
      return;
    }
    const { data, error } = await api.filedata.orphaned();
    if (error) {
      console.error(error);
      return;
    }
    setOrphans(data);
  }, [isAdmin]);

  const checkIntegrity = useCallback(async () => {
    if (!isAdmin) {
      return;
    }
    const { data, error } = await api.filedata.checkIntegrity();
    if (error) {
      console.error(error);
      return;
    }
    setIntegrity(data);
  }, [isAdmin]);

  const removeOrphan = useCallback(async (uid: string) => {
    const { error } = await api.filedata.remove(uid);
    if (error) {
      console.error(error);
      return;
    }
    fetchOrphans();
  }, [fetchOrphans]);

  const removeAllOrphans = useCallback(async () => {
    for (let i = 0; i < orphans.length; i += 1) {
      await removeOrphan(orphans[i].uid);
      if (i % 10 === 0) {
        await fetchOrphans();
      }
    }
    fetchOrphans();
  }, [orphans, removeOrphan, fetchOrphans]);


  useEffect(() => {
    fetchOrphans();
    checkIntegrity();
  }, [fetchOrphans, checkIntegrity]);

  if (!isAdmin) {
    return null;
  }


  return (
    <div>
      <h3 className="text-lg font-bold">Orphaned Files</h3>
      <p className="mb-2 text-gray-600 text-sm">These files are not linked to any inode and can be safely deleted.
        <button
          type="button"
          onClick={removeAllOrphans}
          className="mb-4 text-xs text-white bg-red px-2 py-1 rounded mx-2"
        >
          Remove All
        </button>
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        {orphans.map((o) => (
          <OrphanedFile key={o.uid} data={o} onRemove={removeOrphan} />
        ))}
      </div>
      <h3 className="text-lg font-bold mt-4">Integrity Check</h3>
      <Integrity data={integrity} />



    </div>



  );
}
