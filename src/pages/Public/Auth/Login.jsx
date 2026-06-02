import React, { useState } from "react";
import screenshot3 from "../../../assets/images/auth-img/screenshot3-2x.png";
import "../../../assets/css/auth.css";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {

  const [data, setData] = useState({ email: "", password: "", loading: false });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setData({ ...data, loading: true });

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      
      if (response.data?.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials and try again.";
      toast.error(message)
    } finally {
      setData({ ...data, loading: false });
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 px-4 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row">
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-[360px]">
            <div className="rounded-[40px] border border-slate-200 bg-white/90 p-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.2)]">
              <img
                src={screenshot3}
                className="w-full rounded-[28px] object-cover"
                alt="Instagram preview"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 mx-auto w-[220px] translate-y-10 rounded-[28px] border border-slate-200 bg-white/95 p-4 text-center shadow-lg">
              <p className="text-sm text-slate-500">
                Explore your feed, stay connected, and discover the latest
                moments.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex-1">
          <div className="mx-auto w-full max-w-[420px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.2)]">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <i className="insta-logo bg-no-repeat bg-contain w-10 h-10 block"></i>
              </div>

              <h1 className="text-2xl font-semibold text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your Instagram clone.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="Phone number, username, or email"
                  disabled={data.loading}
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="Password"
                  disabled={data.loading}
                  className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={data.loading}
                  className="w-full rounded-[14px] bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {data.loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span>or</span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Continue with Facebook
            </button>

            <div className="mt-5 text-center text-sm text-slate-500">
              <button
                type="button"
                className="underline underline-offset-2 hover:text-slate-700"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}