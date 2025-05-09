import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ReportLayout = ({ title, description, children, action, footer }) => {
  return (
    <Card className="w-full mx-auto bg-gray-300/5">
      <CardHeader className="space-y-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold text-primary">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>

        {action && <div className="flex justify-end ">{action}</div>}
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="pt-6">
        <div className="space-y-6">{children}</div>
      </CardContent>

      {footer && (
        <>
          <Separator className="my-2" />
          <CardFooter className="bg-muted/5 p-6">{footer}</CardFooter>
        </>
      )}
    </Card>
  );
};

export default ReportLayout;
