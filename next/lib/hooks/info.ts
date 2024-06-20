import { useState, useEffect } from "react";
import api from "@/lib/api";
import { DabihInfo } from "../api/types";

export default function useInfo() {
  const [info, setInfo] = useState<DabihInfo | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.util.info();
      if (!data) {
        return;
      }
      setInfo(data);
    })().catch(console.error);
  }, []);
  return info;
}
