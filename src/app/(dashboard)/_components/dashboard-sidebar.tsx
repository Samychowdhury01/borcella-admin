"use client";
import { Layout, Tag, ShoppingBag, UsersRound, Shapes } from "lucide-react";

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
              <div className="flex items-center gap-x-2 pl-6 py-4 hover:text-slate-600 hover:bg-slate-300/20">
                <UserButton />
                Edit Profile
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
