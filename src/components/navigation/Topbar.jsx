import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { DynamicBreadcrumbs } from "./DynamicBreadcrumbs";

const Topbar = () => {
  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 bg-background border-b p-2 z-50">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <DynamicBreadcrumbs />
    </header>
  );
};

export default Topbar;
