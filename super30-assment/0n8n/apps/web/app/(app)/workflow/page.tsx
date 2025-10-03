// file: app/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";


interface workflowTypes{
    id: number,
    name: string,
    lastUpdated: string,
    created: string,
    isActive: boolean
}
// Mock data for demonstration
const workflows: workflowTypes[] = [
  {
    id: 1,
    name: "My workflow",
    lastUpdated: "1 week ago",
    created: "20 September",
    isActive: false,
  },
];

export default function WorkflowsPage() {
  const [isActive, setIsActive] = useState(workflows[0]?.isActive);

  return (
    <div className="space-y-4">
      {workflows.map((flow) => (
        <Card key={flow.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{flow.name}</h3>
              <p className="text-sm text-muted-foreground">
                Last updated {flow.lastUpdated} | Created {flow.created}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`active-toggle-${flow.id}`} className="text-sm">
                {isActive ? "Active" : "Inactive"}
              </Label>
              <Switch
                id={`active-toggle-${flow.id}`}
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}