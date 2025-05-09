"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";
import { ChevronRight } from "lucide-react";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  if (pathSegments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={href}>
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  
                  <ChevronRight className="size-4"/>
                </span>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    <span className="text-xs">{segment.toUpperCase()}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} as={Link}>
                    <span className="text-xs">{segment.toUpperCase()}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
