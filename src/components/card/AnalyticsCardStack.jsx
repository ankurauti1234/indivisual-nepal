"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/lib/utils";
export default function AnalyticsCardStack() {
  return (
    <div className="h-[25rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({ children, className }) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    title: "Sales Dashboard",
    image: "/images/analytics.png",
  },
  {
    id: 1,
    title: "Marketing Dashboard",
    image: "/images/broadcasters/audience-insights.png",
  },
  {
    id: 2,
    title: "Project Management Dashboard",
    image: "/images/broadcasters/daily-summary-report.png",
  },
];
