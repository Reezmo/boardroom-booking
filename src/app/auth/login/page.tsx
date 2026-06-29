"use client";
import React from "react";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const router = require('next/navigation').useRouter();
  const [showForgot, setShowForgot] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [forgotSent, setForgotSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate sending reset email
    setForgotSent(true);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../../firebase");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
   } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  if (showForgot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-teal-100">
        <div className="w-full max-w-md">
          <div className="rounded-3xl shadow-xl border border-white/20 backdrop-blur-xl bg-white/60 p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-center text-cyan-700 drop-shadow">Forgot Password</h2>
            {forgotSent ? (
              <p className="text-center text-green-600 mb-8">Password reset link sent to your email!</p>
            ) : (
              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-cyan-700">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 bg-white/70 text-gray-800 placeholder-gray-400"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-cyan-400 text-white py-2 rounded-lg font-semibold shadow-cyan-200/60 hover:bg-cyan-500 transition">Send Reset Link</button>
              </form>
            )}
            <button onClick={() => setShowForgot(false)} className="mt-6 w-full bg-gray-200 text-cyan-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Back to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-teal-100">
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-xl border border-white/20 backdrop-blur-xl bg-white/60 p-8 animate-fadeIn">
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-cyan-700 hover:underline text-sm"
          >
            ← Back to Welcome
          </button>
          <h2 className="text-4xl font-extrabold mb-6 text-center text-cyan-700 drop-shadow-sm">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Please login to continue
          </p>
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white/70 text-gray-800 placeholder-gray-400 transition"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white/70 text-gray-800 placeholder-gray-400 transition"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center mb-2">{error}</div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] hover:shadow-cyan-200/60 transition-all"
            >
              Login
            </button>

            {/* Footer Links */}
            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <button type="button" onClick={() => setShowForgot(true)} className="hover:text-cyan-500 transition bg-transparent border-none p-0">Forgot password?</button>
              <button type="button" onClick={() => router.push("/auth/signup")} className="hover:text-cyan-500 transition bg-transparent border-none p-0">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
