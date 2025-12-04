"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface workflowTypes{
    id: string,
    name: string,
    updatedAt: string;
    createdAt: string,
    active: boolean
}




export default function WorkflowsPage() {
  const [workflows, setWorkflows]=useState<workflowTypes[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [isLoading, setIsLoading]= useState(false)


  //we put the function over here because when new workflow became this need to call again
  const workflowDataFetch=async ()=>{
    const res = await axios.get<workflowTypes[]>('http://localhost:8080/api/v0/workflows',{withCredentials:true})
    setWorkflows(res.data)  //may be workflows
    }

    useEffect(()=>{
      workflowDataFetch()
    },[])

    const handleActiveToggle= async(workflowId: string, newStatus: boolean)=>{
            await axios.put(`http://localhost:8080/api/v0/${workflowId}/activated`,{active: newStatus},{
                withCredentials:true
            })
            setWorkflows((prevWorkflows) =>
                prevWorkflows.map((wf) =>
                  wf.id === workflowId ? { ...wf, active: newStatus } : wf
                )
              );
    }
    type FormEvent= React.FormEvent<HTMLFormElement>

    const handleCreateWorkflow=async (e: FormEvent)=>{
      e.preventDefault();
      if (!newWorkflowName.trim()) return; 
          await axios.post('http://localhost:8080/api/v0/workflows', { name: newWorkflowName },
            {withCredentials:true}
          );
          setNewWorkflowName("");
          setIsFormOpen(false);
          setIsLoading(false)
          workflowDataFetch();

    }
   
    
return(
          <div className="relative min-h-screen p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">My Workflows</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Workflow
                </Button>
            </div>

            {isLoading ? (
                <p>Loading workflows...</p>
            ) : workflows.length > 0 ? (
                <div className="space-y-4">
                    {workflows.map((flow) => (
                        <Link href={`/workflows/${flow.id}`} key={flow.id} className="block">
                            <Card className="hover:border-primary/60 transition-colors">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{flow.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Last updated {new Date(flow.updatedAt).toLocaleDateString()} | Created on {new Date(flow.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Label htmlFor={`active-toggle-${flow.id}`} className="text-sm cursor-pointer">
                                            {flow.active ? "Active" : "Inactive"}
                                        </Label>
                                        <Switch
                                            id={`active-toggle-${flow.id}`}
                                            checked={flow.active}
                                            onCheckedChange={(newStatus) => handleActiveToggle(flow.id, newStatus)}
                                            onClick={(e) => e.preventDefault()} // Prevents link navigation on toggle
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-16">
                    <h2 className="text-xl font-semibold">No Workflows Yet</h2>
                    <p className="text-muted-foreground mt-2">Click Create Workflow to get started.</p>
                </div>
            )}

            {isFormOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => setIsFormOpen(false)} 
                >
                    <Card 
                        className="w-full max-w-md" 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <form onSubmit={handleCreateWorkflow}>
                            <CardHeader>
                                <CardTitle>Create a New Workflow</CardTitle>
                                <CardDescription>Give your new workflow a name to get started.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Label htmlFor="workflow-name" className="sr-only">Workflow Name</Label>
                                <Input
                                    id="workflow-name"
                                    type="text"
                                    placeholder="e.g., 'My Awesome Automation'"
                                    value={newWorkflowName}
                                    onChange={(e) => setNewWorkflowName(e.target.value)}
                                    autoFocus
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );

}