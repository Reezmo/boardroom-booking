"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const { auth } = await import("../../firebase");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setSuccess("Signup successful! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-teal-100">
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-cyan-100 via-white to-teal-100 p-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-4 text-cyan-700 hover:underline text-sm"
          >
            ← Back to Welcome
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-700 drop-shadow">Sign Up</h2>
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-700">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-cyan-400 bg-background text-foreground"
                required
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-cyan-400 bg-background text-foreground"
                required
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-cyan-400 bg-background text-foreground"
                required
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button
              type="submit"
              className="w-full bg-cyan-400 text-white py-2 rounded-lg font-semibold shadow-cyan-200/60 hover:bg-cyan-500 transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
