// src/pages/VerifyPending.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";

interface VerifyPendingProps {
  email?: string; // Optional: pass email from signup form or ask user to input
}

export default function VerifyPending({ email: initialEmail }: VerifyPendingProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleResend = async () => {
    if (!email) return alert("Please enter your email.");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/v1/user/resend-verification", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="h-[380px] w-[350px] border-2 border-gray-300 shadow-lg gap-9 flex justify-center items-center flex-col rounded-xl">
        <div>
          <div  className="w-80 mx-50 my-auto text-center">
            <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
            <p>We sent a verification link to your email. <br/> Click it to activate your account.</p>
          </div>
        </div>

        <div>
          <div className="flex justify-center">
            Didn't receive an email?
          </div>
          {!initialEmail && (
          <InputBox type="email" placeholder="Confirm your email" onChange={(e) => setEmail(e.target.value)} />       
          )}

          <div className="flex justify-between items-center gap-6 mt-4">
            <button onClick={handleResend} disabled={loading} style={{ padding: "10px 20px" }} className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-black dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >
            {loading ? "Sending..." : "Resend Verification"}
            </button>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}

            <button onClick={() => navigate("/signin")} className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-black dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >
            Go to Sign In
            </button>
          </div>
        </div>
      </div>   
    </div>
    
  );
}
