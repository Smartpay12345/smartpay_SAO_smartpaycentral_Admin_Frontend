// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/dashboard/sidebar-context'
import { SidebarTrigger } from '@/components/dashboard/sidebar-trigger'
import {AuthGuard} from '@/components/auth/auth-guard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
    <SidebarProvider>
      <div className="h-dvh overflow-hidden">
        <Sidebar />

        {/* mobile-only, floats above content, opens the drawer */}
        <div className="fixed left-2 top-4 z-20 lg:hidden">
          <SidebarTrigger />
        </div>

    <div className="flex h-dvh flex-col lg:ml-64">
    <main className="min-h-0 flex-1 overflow-y-auto p-4">{children}</main>
  </div>
      </div>
    </SidebarProvider>

    </AuthGuard>
  )
}