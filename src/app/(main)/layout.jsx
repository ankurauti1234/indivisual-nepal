import { AppSidebar } from "@/components/navigation/sidebar/app-sidebar";
import { DynamicBreadcrumbs } from "@/components/navigation/DynamicBreadcrumbs";
import Topbar from "@/components/navigation/Topbar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="shadow-inner border overflow-hidden h-[97vh] p-0 m-0">
        <Topbar />
        <main className="p-4 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
