// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { SidebarProvider } from '@/components/dashboard/sidebar-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex h-screen flex-col lg:ml-64">
          <Topbar userName="Oluwagbotemi O." userRole="Account Manager" notificationCount={5} />
          <main className="flex-1 overflow-y-auto bg-background px-4 pb-6 pt-20 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}