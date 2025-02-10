"use client";

import { Card, CardHeader  } from "@/components/ui/card";
import { ReactNode } from "react";

// Updated DataCard to accept props
interface DataCardProps {
  title?: string; // Title can be passed as a prop
  children?: ReactNode; // Children to allow custom content inside the card
}
 
const DataCard = ({ title, children }: DataCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader title={title}>
      {children ? children : "Content"}
      </CardHeader>
    </Card>
  );
};

export default DataCard;
