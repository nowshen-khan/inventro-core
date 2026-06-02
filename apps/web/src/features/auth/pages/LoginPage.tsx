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

    console.log("FORM SUBMITTED");

    try {
      setLoading(true);

      console.log(email, password);
      await login(email, password);
      console.log("LOGIN SUCCESS");
      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold">ERP Login</h1>

        <div className="mb-4">
          <input
            className="w-full rounded border p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="w-full rounded border p-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white"
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
