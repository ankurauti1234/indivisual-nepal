import React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const ChartCard = ({ icon, title, description, action, footer, chart }) => {
  return (
    <Card className="w-full flex-1 border-2 border-ring/15 bg-card shadow-none rounded-xl hover:shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] transition-all duration-300">
      <CardHeader className="pb-4 border-b border-ring/15 ">
        <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-between gap-6">
          <CardTitle className="flex flex-1 items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </CardTitle>
          {action && <div className="w-fit flex-1">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full h-full">{chart}</div>
      </CardContent>
      {footer && (
        <CardFooter className="pt-4 border-t border-ring/15 ">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default ChartCard;
