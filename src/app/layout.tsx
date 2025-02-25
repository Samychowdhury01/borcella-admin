import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import Navbar from "@/components/layout/navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Borcella | Admin Dashboard",
  description: "Admin dashboard to manage borcella's data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            <div className="flex w-full">
              <DashboardSidebar />
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
        </body>
      </html>
    </ClerkProvider>
  );
}
