import { useState } from "react";
import API from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
type Props = { type: "login" | "register" };

export default function AuthForm({ type }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post(`/api/${type}`, { email, password });
      if (res.data.token) {
        await login(res.data.token);
        nav("/dashboard");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center capitalize text-blue-700 mb-4">
            {type === "login" ? "Login to your account" : "Create an account"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 w-full rounded-md shadow transition"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {type === "login" ? (
            <span>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
