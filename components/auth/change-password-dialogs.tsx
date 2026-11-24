"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChangePasswordForm } from "./change-password-form";
import { useAuth } from "@/lib/auth/store";



// normal use, e.g. Settings → Security
export function ChangePasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { admin } = useAuth();
  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-md">
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
          <div className="border-b bg-red-50 px-5 py-3">
            <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
          </div>
          <div className="p-5">
            <ChangePasswordForm email={admin.email} onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}