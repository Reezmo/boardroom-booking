"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapperComponent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 via-white to-teal-100">
      {/* Left Side - Branding */}
  <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-teal-100 bg-white/70 backdrop-blur-lg p-12 shadow-inner">
        {/* BoardSync Logo */}
        <img
          src="/logo2.png"
          alt="RoomReserve Logo"
          className="w-120 h-80 mb-2 drop-shadow-lg"
          style={{ background: "none" }}
        />
        
        <p className="text-lg text-gray-600 text-center max-w-md">
          Your smart boardroom booking solution. Sign in to manage meetings or
          create an account to get started!
        </p>
      </div>

      {/* Right Side - Actions */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-8">
            Get Started
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <button
                onClick={() => router.push("/auth/login")}
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] hover:shadow-cyan-200/60 transition-all"
            >
              Login
            </button>
            <button
                onClick={() => router.push("/auth/signup")}
              className="w-full bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 py-3 rounded-lg font-semibold shadow hover:shadow-md hover:scale-[1.01] transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
