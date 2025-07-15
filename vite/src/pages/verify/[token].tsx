import useSession from "@/Session";
import { useEffect } from "react";
import { useNavigate, Navigate, useParams } from "react-router";

export default function Token() {
  const navigate = useNavigate();
  const params = useParams<{
    token: string;
  }>();
  const { verifyToken } = useSession();

  const { token } = params;

  useEffect(() => {
    if (!token) {
      return;
    }
    verifyToken(token).then(() =>
      navigate("/key")
    ).catch((error) => console.error("Token verification failed:", error));
  }, [token, verifyToken, navigate]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      Verifying token...
    </div>
  );
}
