import { useParams } from "react-router";

export default function Callback() {
  const params = useParams<{
    providerId: string;
  }>();
  const { providerId } = params;




  return (
    <div>
      Callback from {providerId}
    </div>
  );
}
