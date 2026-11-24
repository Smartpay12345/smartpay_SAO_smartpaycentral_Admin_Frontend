import type { Metadata } from "next";
import { ResetPasswordScreen } from "@/components/auth/reset-password-screen";

export const metadata: Metadata = {
  title: "Reset password | SaoFuel",
  referrer: "no-referrer",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordScreen token={typeof token === "string" && token ? token : null} />;
}