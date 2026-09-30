"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your submit logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl border-none sm:p-10">
        
        {/* Decorative Top-Right Soft Red Circle */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-100/60 pointer-events-none" />

        {/* Decorative Bottom-Left Soft Red Circle */}
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-red-100/60 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col gap-6">
          
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome Back !
            </DialogTitle>
          </DialogHeader>

          {/* Login Section Header */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">Login</h3>
            <DialogDescription className="text-xs text-gray-400">
              How do i get started?
            </DialogDescription>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-gray-700 hover:text-red-600 transition"
              >
                Forgot password
              </Link>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>

        </div>
      </DialogContent>
    </Dialog>
  );
}