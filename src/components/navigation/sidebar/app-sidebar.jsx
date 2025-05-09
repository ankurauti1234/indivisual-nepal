"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  Gamepad,
  LifeBuoy,
  Map,
  PieChart,
  Play,
  Send,
  Settings,
  Settings2,
  SquareTerminal,
  Video,
} from "lucide-react";

import { NavMain } from "@/components/navigation/sidebar/nav-main";
import { NavSecondary } from "@/components/navigation/sidebar/nav-secondary";
import { NavUser } from "@/components/navigation/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Ankur Auti",
    email: "ankur.auti@inditronics.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Television",
      url: "/dashboard/tv",
      icon: SquareTerminal,
      items: [
        {
          title: "Broadcasters",
          url: "/dashboard/tv/broadcasters",
        },
        {
          title: "Advertisers",
          url: "/dashboard/tv/ads",
        },
        {
          title: "Brands",
          url: "/dashboard/tv/brands",
        },
        {
          title: "Sports",
          url: "/dashboard/tv/sports",
        },
      ],
    },
    {
      title: "Radio",
      url: "/dashboard/radio",
      icon: Bot,
      items: [
        {
          title: "Operator",
          url: "/dashboard/radio/broadcasters",
        },
        {
          title: "Advertisers & Brands",
          url: "/dashboard/radio/ads",
        },
        {
          title: "Listenership",
          url: "/dashboard/radio/listenership",
        },
      ],
    },
    {
      title: "YouTube",
      url: "/dashboard/youtube",
      icon: Video,
      items: [
        {
          title: "Creators",
          url: "/dashboard/youtube/creators",
        },
        {
          title: "Advertisers",
          url: "/dashboard/youtube/ads",
        },
        {
          title: "Viewership",
          url: "/dashboard/youtube/viewership",
        },
      ],
    },
    {
      title: "OTT",
      url: "/dashboard/ott",
      icon: Play,
      items: [
        {
          title: "Platforms",
          url: "/dashboard/ott/platforms",
        },
        {
          title: "Advertisers",
          url: "/dashboard/ott/ads",
        },
        {
          title: "Subscribers",
          url: "/dashboard/ott/subscribers",
        },
      ],
    },
    {
      title: "Gaming",
      url: "/dashboard/gaming",
      icon: Gamepad,
      items: [
        {
          title: "Publishers",
          url: "/dashboard/gaming/publishers",
        },
        {
          title: "Advertisers",
          url: "/dashboard/gaming/ads",
        },
        {
          title: "Players",
          url: "/dashboard/gaming/players",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              asChild
              className="hover:bg-black/0 hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <a href="/dashboard">
                <img src="/assets/indi.png" alt="logo" className="h-14" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <hr />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
        <NavSecondary
          items={data.navSecondary}
          pathname={pathname}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
