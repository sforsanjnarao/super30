// file: components/header.tsx
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Personal</h1>
        <p className="text-muted-foreground">
          Workflows and credentials owned by you
        </p>
      </div>
      <Button>
        Create Workflow  
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

    </header>
  );
}