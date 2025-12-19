
// src/pages/Verify.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [hasVerified, setHasVerified] = useState(false); // <-- new

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (!token || hasVerified) return; // <-- stop if already verified

    (async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/v1/user/verify",
          { token,
            email
          }
        );
        console.log("here is your verify email response: ", response);
        setStatus("Email verified! Redirecting to sign-in...");
        setHasVerified(true); // <-- mark as verified
        if(response.data.findPeople.role == "BUSINESS"){
          navigate("/business-dashboard")
        } else{
          navigate("/user-dashboard");
        }
        
      }
      catch (err: any) {
        setStatus(err.response?.data?.message || "Verification failed.");
        console.log(err);
        console.log(err.response?.data?.message);
        setTimeout(() => navigate("/verify-pending"), 2000);
      }
    })();
  }, [searchParams, navigate, hasVerified]);

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
}
