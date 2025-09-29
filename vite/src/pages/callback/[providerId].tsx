import useSession from "@/Session";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function Callback() {
  const params = useParams<{
    providerId: string;
  }>();
  const { providerId } = params;

  const { signinCallback } = useSession();


  useEffect(() => {
    if (!providerId) {
      console.error("No providerId in params");
      return;
    }
    signinCallback(providerId);
  }, [signinCallback, providerId]);


  return (
    <div>
      Callback from {providerId}
    </div>
  );
}
