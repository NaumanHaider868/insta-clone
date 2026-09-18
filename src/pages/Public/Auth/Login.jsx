import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InstaW from "../../../assets/images/insta-white.svg";
import { loginUser } from "../../../services/api";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      await loginUser({ email: identifier.trim(), password });
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Could not log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-[#f5f5f5] sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[430px] items-center justify-center">
        <div className="w-full">
          <section className="border-t-4 border-[#4c77e2] border-x border-b border-[#363636] bg-[#1c1c1c] px-6 py-9 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:px-10">
            <img src={InstaW} alt="Instagram" className="mx-auto mb-4 h-auto w-[175px]" />
            <p className="mb-8 text-sm text-[#a8a8a8]">Log in to continue to your account</p>
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              <div className="text-left">
                <label htmlFor="login-identifier" className="sr-only">Email</label>
                <input
                  id="login-identifier"
                  type="email"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  className="h-10 w-full rounded-sm border border-[#363636] bg-[#262626] px-2.5 text-xs text-white outline-none transition placeholder:text-[#8e8e8e] focus:border-[#737373]"
                />
              </div>
              <div className="relative text-left">
                <label htmlFor="login-password" className="sr-only">Password</label>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="h-10 w-full rounded-sm border border-[#363636] bg-[#262626] px-2.5 pr-10 text-xs text-white outline-none transition placeholder:text-[#8e8e8e] focus:border-[#737373]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-xs text-[#a8a8a8]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && <p role="alert" className="pt-1 text-left text-xs text-[#ff6b81]">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-9 w-full rounded-lg bg-[#4c77e2] text-sm font-semibold text-white transition hover:bg-[#3f68d2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-4 text-xs font-semibold text-[#8e8e8e]">
              <span className="h-px flex-1 bg-[#363636]" />
              OR
              <span className="h-px flex-1 bg-[#363636]" />
            </div>
            <button type="button" className="text-xs font-semibold text-[#385185]">Log in with Facebook</button>
            <button type="button" className="mt-5 block w-full text-xs text-[#9ec5ff]">Forgot password?</button>
          </section>

          <section className="mt-3 border border-[#363636] bg-[#1c1c1c] p-5 text-center text-sm text-[#f5f5f5]">
            Don&apos;t have an account? <Link to="/register" className="font-semibold text-[#7ea7ff] hover:underline">Sign up</Link>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;
