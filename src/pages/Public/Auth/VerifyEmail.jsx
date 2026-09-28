import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InstaW from "../../../assets/images/insta-white.svg";
import { verifyEmail } from "../../../services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "Confirming your email address..." : "This verification link is missing its token."
  );

  useEffect(() => {
    if (!token) return undefined;

    let isCurrent = true;
    verifyEmail(token)
      .then(() => {
        if (isCurrent) {
          setStatus("success");
          setMessage("Your email is verified. You can now log in.");
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setStatus("error");
          setMessage(error.message || "We could not verify this email link.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const messageColor = status === "success" ? "text-[#7de7a5]" : status === "error" ? "text-[#ff6b81]" : "text-[#a8a8a8]";

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-[#f5f5f5] sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[430px] items-center justify-center">
        <section className="w-full border-t-4 border-[#4c77e2] border-x border-b border-[#363636] bg-[#1c1c1c] px-6 py-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:px-10">
          <img src={InstaW} alt="Instagram" className="mx-auto mb-8 h-auto w-[175px]" />
          <h1 className="mb-3 text-lg font-semibold">
            {status === "success" ? "Email verified" : status === "error" ? "Verification failed" : "Verifying your email"}
          </h1>
          <p role={status === "error" ? "alert" : "status"} className={`mb-7 text-sm leading-6 ${messageColor}`}>
            {message}
          </p>
          {status !== "verifying" && (
            <Link
              to={status === "success" ? "/login" : "/register"}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#4c77e2] px-6 text-sm font-semibold text-white transition hover:bg-[#3f68d2]"
            >
              {status === "success" ? "Go to login" : "Back to sign up"}
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}

export default VerifyEmail;