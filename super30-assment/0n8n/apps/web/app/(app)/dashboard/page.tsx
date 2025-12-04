'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateWorkflowDialog } from "@/components/dashboard/CreateWorkflowDialog"; // We will create this next
import axios from "axios";
import Head from "next/head";

// Define a type for our workflow data for type safety
export type Workflow = {
  id: string;
  name: string;
  active: boolean;
  updatedAt: string;
};



export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/v0/workflows",
        { withCredentials: true } // ✅ sends cookies
      );

      setWorkflows(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchWorkflows();
}, []);

  // We will add the delete handler later

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Workflows</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Main Content: Table or Empty State */}
      <div className="border rounded-lg">
        {isLoading ? (
          // You can create a more sophisticated Skeleton loader here later
          <p className="p-4">Loading workflows...</p>
        ) : workflows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant={workflow.active ? "default" : "secondary"}>
                      {workflow.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(workflow.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Add Link from next/link for navigation */}
                        <DropdownMenuItem onClick={() => window.location.href=`/workflows/${workflow.id}`}>Open</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold">No Workflows Yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Get started by creating your first automated workflow.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Create Workflow</Button>
          </div>
        )}
      </div>

      {/* The Dialog for creating a new workflow */}
      <CreateWorkflowDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}