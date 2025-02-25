import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Logo from "./logo";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b  p-4 shadow-sm w-full">
      <div>
        {/* "TODO: Will add menu" */}
        <Logo />
      </div>
      <SidebarTrigger className="md:hidden" />
    </header>
  );
};

export default Navbar;
