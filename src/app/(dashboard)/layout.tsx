import { ClerkProvider } from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/(dashboard)/_components/dashboard-sidebar";
import Navbar from "@/app/(dashboard)/_components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <SidebarProvider>
        <div className="flex w-full">
          <div>
            <DashboardSidebar />
          </div>
          <SidebarInset className="flex flex-col w-full">
            <div className="md:hidden">
              <Navbar />
            </div>
            <div className="flex-1">
              <main className="h-full">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ClerkProvider>
  );
}
