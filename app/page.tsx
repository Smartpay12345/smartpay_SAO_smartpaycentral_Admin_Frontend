"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AuthFlowModal } from "@/components/modals/AuthFlowModal";

export default function HeroSection() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<"get-started" | "login">("get-started");
  return (
    <main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-black">
      {/* Background Image */}
      <Image
        src="/images/sao-station.svg"
        alt="SAO Filling Station"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 via-15% to-black/20" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Spacer pushing content down from the top */}
      <div className="relative z-10 h-16 w-full md:h-24" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-8 pt-16 md:px-10 md:pb-12 md:pt-28">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center">
          
          {/* Combined Left Column: Text + Vertical Line side-by-side */}
          <div className="flex items-stretch gap-6 md:col-span-8 md:self-end md:translate-y-6">
            
            {/* Left Text Block */}
            <div className="max-w-md space-y-2.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-4xl lg:text-5xl">
                Sao Fuel Pay
              </h1>
              <p className="text-sm font-medium leading-none text-white tracking-[-0.005em] sm:text-base">
                Your Smarter Management, Finance, Monitoring System.
              </p>
              <p className="text-sm font-bold text-red-600 sm:text-base">
                Built For SAO Filling Station
              </p>

              {/* Small Horizontal Accent Line */}
              <div className="hidden pt-2 md:block">
                <div className="h-[2px] w-12 bg-white/60" />
              </div>
            </div>

            {/* Vertical Divider Line — Stretches exactly to match text block height */}
            <div className="hidden items-center md:flex md:pl-2">
              <div className="h-full w-[1px] bg-white/60" />
            </div>

          </div>

          {/* Right Action Column */}
          <div className="w-full max-w-xs space-y-3 md:col-span-4 md:self-start md:-translate-y-10 md:justify-self-end">
            <p className="text-sm font-medium text-white">New Here ?</p>
            
            <div className="flex flex-col gap-3">
        <Button size="lg" className="mt-2 w-full py-6 text-base"  onClick={() => { setAuthStep("get-started"); setIsLoginModalOpen(true); }}>
          Get Started
        </Button>
            
        <Button size="lg" className="mt-2 w-full py-6 text-base" onClick={() => {setIsLoginModalOpen(true); setAuthStep("login")}}>
          Login
        </Button>
   
            </div>
          </div>

        </div>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 pb-4 text-center">
        <p className="text-[11px] font-medium text-white/60">
          Powered by Smartpay studio
        </p>
      </div>

    


<AuthFlowModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} initialStep={authStep} />
    </main>
  );
}