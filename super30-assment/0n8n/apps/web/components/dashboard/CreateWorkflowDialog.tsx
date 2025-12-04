'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateWorkflowDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

 interface Workflow {
        id: string;
        name: string;
        authorId: string;
        webhookId: string | null;
        active: boolean;
        nodes: any[];        // you can later replace `any` with Node type
        connections: any[];  // same here for Edge type
        createdAt: string;
        updatedAt: string;
      }
  const handleCreate = async () => {
    if (!name) {
      toast.error("Workflow name cannot be empty.");
      return;
    }

    try {
      setIsCreating(true);
    const response= await axios.post<Workflow>('http://localhost:8080/api/v0/workflows',{name},{
        headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,      
    })
        const newWorkflow=response.data
      toast.success(`Workflow "${name}" created successfully!`);
      onClose();
      // Redirect to the new workflow's editor page
      router.push(`/workflows/${newWorkflow.id}`);

    } catch (error:any) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Workflow</DialogTitle>
          <DialogDescription>
            Give your new workflow a name to get started. You can change this later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="My Awesome Automation"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleCreate} 
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}