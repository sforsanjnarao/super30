'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AddCredentialDialog } from "@/components/credentials/AddCredentialDialog"; // We will create this
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import axios from "axios";

export type Credential = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  interface Credential {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}
    const fetchCredentials = async () => {
    try {
        setIsLoading(true);

        const response = await axios.get<Credential[]>(
        "http://localhost:8080/api/v0/credentials/",
        {
            withCredentials: true,
        }
        );

        setCredentials(response.data);

    } catch (error: any) {
        toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch credentials"
        );
    } finally {
        setIsLoading(false);
    }
    };

  useEffect(() => {
    fetchCredentials();
  }, []);
  
  const handleDelete = async (credentialId: string) => {
    const promise = Promise.resolve(
        axios.delete(
        `http://localhost:8080/api/v0/credentials/${credentialId}`,
        {
            withCredentials: true,
        }
        )
    );

    toast.promise(promise, {
        loading: "Deleting credential...",
        success: () => {
        fetchCredentials(); // Refresh list after deletion
        return "Credential deleted successfully!";
        },
        error: (err: any) =>
        err?.response?.data?.message || "Failed to delete credential.",
    });
};

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Credentials</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      <div className="border rounded-lg">
        {isLoading ? (
          <p className="p-4">Loading credentials...</p>
        ) : credentials.length > 0 ? (
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((cred) => (
                <TableRow key={cred.id}>
                  <TableCell className="font-medium">{cred.name}</TableCell>
                  <TableCell>{cred.type}</TableCell>
                  <TableCell>{new Date(cred.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this credential.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cred.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold">No Credentials Found</h3>
            <p className="text-muted-foreground mt-2 mb-4">Add a credential to connect your apps.</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Credential</Button>
          </div>
        )}
      </div>
      
      <AddCredentialDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchCredentials} 
      />
    </div>
  );
}