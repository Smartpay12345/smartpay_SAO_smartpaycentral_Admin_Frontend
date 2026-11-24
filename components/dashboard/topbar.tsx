import { SidebarTrigger } from './sidebar-trigger'

export function Topbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center border-b bg-background px-4 lg:left-0 lg:px-6">
      <SidebarTrigger />
    </header>
  )
}