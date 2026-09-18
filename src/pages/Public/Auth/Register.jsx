import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InstaW from "../../../assets/images/insta-white.svg";
import { registerUser } from "../../../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.userName.trim() || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError("Complete all fields to create your account.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({
        userName: form.userName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess("Registration successful. Please verify your email, then log in.");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (registerError) {
      setError(registerError.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-[#f5f5f5] sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[430px] items-center justify-center">
        <div className="w-full">
          <section className="border-t-4 border-[#4c77e2] border-x border-b border-[#363636] bg-[#1c1c1c] px-6 py-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:px-10">
            <img src={InstaW} alt="Instagram" className="mx-auto mb-4 h-auto w-[175px]" />
            <p className="mb-6 text-sm font-semibold leading-5 text-[#a8a8a8]">Sign up to see photos and videos from your friends.</p>
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              {[
                ["userName", "Username", "text", "username"],
                ["firstName", "First name", "text", "given-name"],
                ["lastName", "Last name", "text", "family-name"],
                ["email", "Email", "email", "email"],
              ].map(([field, placeholder, type, autoComplete]) => (
                <div key={field} className="text-left">
                  <label htmlFor={`register-${field}`} className="sr-only">{placeholder}</label>
                  <input
                    id={`register-${field}`}
                    type={type}
                    value={form[field]}
                    onChange={updateField(field)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="h-10 w-full rounded-sm border border-[#363636] bg-[#262626] px-2.5 text-xs text-white outline-none transition placeholder:text-[#8e8e8e] focus:border-[#737373]"
                  />
                </div>
              ))}
              {[
                ["password", "Password", showPassword, setShowPassword],
                ["confirmPassword", "Confirm password", showConfirmPassword, setShowConfirmPassword],
              ].map(([field, placeholder, visible, setVisible]) => (
                <div key={field} className="relative text-left">
                  <label htmlFor={`register-${field}`} className="sr-only">{placeholder}</label>
                  <input
                    id={`register-${field}`}
                    type={visible ? "text" : "password"}
                    value={form[field]}
                    onChange={updateField(field)}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    className="h-10 w-full rounded-sm border border-[#363636] bg-[#262626] px-2.5 pr-10 text-xs text-white outline-none transition placeholder:text-[#8e8e8e] focus:border-[#737373]"
                  />
                  <button
                    type="button"
                    aria-label={visible ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`}
                    onClick={() => setVisible((currentVisible) => !currentVisible)}
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-xs text-[#a8a8a8]"
                  >
                    {visible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              ))}
              {error && <p role="alert" className="pt-1 text-left text-xs text-[#ff6b81]">{error}</p>}
              {success && <p className="pt-1 text-left text-xs text-[#7de7a5]">{success}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-9 w-full rounded-lg bg-[#4c77e2] text-sm font-semibold text-white transition hover:bg-[#3f68d2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
            </form>
            <p className="mt-5 text-xs leading-4 text-[#8e8e8e]">By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.</p>
          </section>

          <section className="mt-3 border border-[#363636] bg-[#1c1c1c] p-5 text-center text-sm text-[#f5f5f5]">
            Have an account? <Link to="/login" className="font-semibold text-[#7ea7ff] hover:underline">Log in</Link>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Register;
