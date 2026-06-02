import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("admin@erp.com");

  const [password, setPassword] = useState("admin123");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      navigate("/");
    } catch (error: any) {
      console.error(error);

      const message = error?.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-2xl backdrop-blur">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-lg">
            I
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Inventro
          </h1>

          <p className="mt-3 text-center text-sm font-medium text-slate-500">
            Modern ERP for Smarter Operations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          © 2026 Inventro ERP. All rights reserved.
        </div>
      </div>
    </div>
  );
}
