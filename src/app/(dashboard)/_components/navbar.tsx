import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Logo from "./logo";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b  p-4 shadow-sm w-full bg-blue-2">
      <div>
        {/* "TODO: Will add menu" */}
        <Logo />
      </div>
      <SidebarTrigger />
    </header>
  );
};

export default Navbar;
