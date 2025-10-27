
import useSession from "@/Session";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function SignInSuccess() {
  const navigate = useNavigate();
  const params = useParams<{
    token: string;
  }>();
  const { token } = params;
  const { saveToken } = useSession();

  useEffect(() => {
    if (!token) {
      return;
    }
    saveToken(token)
      .then(() => navigate("/key"))
      .catch(console.error)
  }, [token, saveToken, navigate]);


  return (
    <div>
      Sign in successful! You are being redirected...
    </div>
  );

}
