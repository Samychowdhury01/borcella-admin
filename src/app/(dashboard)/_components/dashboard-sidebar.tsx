"use client";
import {
  Layout,
  Tag,
  ShoppingBag,
  UsersRound,
  Shapes,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

import { UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import SidebarItem from "./sidebar-item";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

// Menu items.
const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Shapes,
    label: "Collections",
    href: "/collections",
  },
  {
    icon: Tag,
    label: "Products",
    href: "/products",
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    href: "/orders",
  },
  {
    icon: UsersRound,
    label: "Customers",
    href: "/customers",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const routes = guestRoutes;
  return (
    <Sidebar>
      <SidebarContent className="bg-blue-2 shadow-xl">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="h-10 m-auto p-4 mb-5">
                <Logo />
              </div>
              {routes.map((route) => (
                <SidebarItem key={route.href} route={route} />
              ))}
              <Button
                onClick={() => signOut({ redirectTo: "/" })}
                className="cursor-pointer flex items-center justify-start gap-x-1 ml-6 mt-5 w-1/2"
              >
                <LogOut />
                <p>Sign Out</p>
              </Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
