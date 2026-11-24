"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AuthFlowModal } from "@/components/modals/AuthFlowModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/store";
import { Loader2 } from "lucide-react";


interface UserOption {
  id: string;
  name: string;
  role: string;
  avatar: string;
  enabled: boolean;
}

const USER_OPTIONS: UserOption[] = [
  { id: "creator", name: "User 1", role: "Creator", avatar: "/images/creator.svg", enabled: true },
  { id: "sub-admin", name: "User 2", role: "Sub Admin", avatar: "/images/sub.svg", enabled: false },
  { id: "support", name: "User 3", role: "Support", avatar: "/images/support.svg", enabled: false },
];

export default function HeroSection() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
   const { status, admin } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);

 const handleSelectUser = (user: UserOption) => {
  if (!user.enabled) return;
  setSelectedUser(user);
  setIsLoginModalOpen(true);
};

    const signedIn = status === "authenticated" && !!admin && !admin.must_change_password;
     useEffect(() => {
    if (signedIn) router.replace("/dashboard");
  }, [signedIn, router]);

  // start loading the dashboard code while the user is still typing their password
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  if (signedIn) return <RedirectScreen />;

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#1a0505]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
     <div className="absolute -bottom-20 -left-20 h-[198px] w-[198px] rounded-full bg-[#E50019]/20 pointer-events-none" />

      {!isLoginModalOpen ? (
        // ── State A: User Picker Landing Page ──
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between gap-8 px-6 md:px-10">
          
          {/* Pump image locked to the left side */}
          <div className="relative hidden mt-24 flex-shrink-0 md:block">
            <Image
              src="/images/tankDrop.svg"
              alt=""
              width={160}
              height={160}
              priority
              className="pointer-events-none opacity-90 lg:w-[200px] lg:h-[200px]"
            />
          </div>

          {/* Central User Picker Content */}
          <div className="flex flex-col items-center gap-10 text-center mx-auto ">
            <div className="flex flex-col items-center gap-4">
                 <Image src="/logo.svg" alt="SAO Petrol" width={60} height={60}  className=""/>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Who&apos;s using SAO fuel pay?</h1>
              <p className="max-w-md text-xs text-white/60 sm:text-sm">
                Kindly login to access your specific and assigned role, suspicious logins will be blocked and suspended
              </p>
            </div>

            </div>
         
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 sm:gap-5">
  {USER_OPTIONS.map((user) => (
    <button
      key={user.id}
      onClick={() => handleSelectUser(user)}
      className="flex w-full flex-col items-center gap-4 rounded-2xl bg-[#282A2D] p-4 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:w-36 sm:p-5"
    >
      <span className="text-xs font-medium text-white/80">{user.name}</span>
      <span className="h-14 w-14 overflow-hidden rounded-full bg-white/10 sm:h-16 sm:w-16">
        <Image src={user.avatar} alt={user.name} width={64} height={64} className="h-full w-full object-cover" />
      </span>
   <span className="text-[11px] text-white/50">
  {user.role}{!user.enabled && " · Coming soon"}
</span>
    </button>
  ))}
</div>
          </div>

          {/* Balancing spacer so the user cards stay precisely centered */}
          <div className="hidden w-[160px] flex-shrink-0 md:block lg:w-[200px]" aria-hidden />
        </div>
      ) : (
        // ── State B: Modal Open (Proper 3-Part Spacing Layout) ──
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8">
          
          {/* Part 1: Pump Image */}
          <div className="relative hidden flex-shrink-0 md:block">
            <Image
              src="/images/tankDrop.svg"
              alt=""
              width={160}
              height={160}
              priority
              className="pointer-events-none opacity-90 lg:w-[200px] lg:h-[200px]"
            />
          </div>

          {/* Part 2: Marketing Text (Sits cleanly between image and modal on large screens) */}
          <div className="hidden max-w-sm space-y-3 lg:block xl:max-w-md -ml-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Sao Fuel Pay
            </h1>
            <p className="text-sm font-medium leading-snug text-white sm:text-base">
              Your Smarter Management, Finance, Monitoring System.
            </p>
            <p className="text-sm font-bold text-red-600 sm:text-base">Built For SAO Filling Station</p>
            <div className="pt-2">
              <div className="h-[2px] w-12 bg-white/60" />
            </div>
          </div>

          {/* Part 3: Empty layout placeholder matching modal width so `justify-between` aligns everything perfectly */}
          <div className="hidden w-full max-w-[450px] flex-shrink-0 lg:block" aria-hidden />
        </div>
      )}

      {!isLoginModalOpen && (
        <div className="relative z-10 pb-6 pt-16 text-center">
          <p className="text-[11px] font-medium text-white/40">Powered by Smartpay Product studio</p>
        </div>
      )}

      <AuthFlowModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        initialStep="login"
        selectedRole={selectedUser?.role}
      />
    </main>
  );
}

function RedirectScreen() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-black text-white">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm font-medium">Taking you to your dashboard…</p>
    </main>
  );
}