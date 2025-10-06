"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


interface workflowTypes{
    id: string,
    name: string,
    updatedAt: string;
    created: string,
    active: boolean
}

interface WorkflowResponse{
    workflow:workflowTypes[]
}


export default function WorkflowsPage() {
  const [workflows, setWorkflows]=useState<workflowTypes[]>([])

    useEffect(()=>{
        const dataFetch=async ()=>{
            const res = await axios.get<WorkflowResponse>('http://localhost:8080/api/v0/workflows')
            setWorkflows(res.data.workflow)  //may be workflows
        }
        dataFetch()
    },[])

    const handleActiveToggle= async(workflowId: string, newStatus: boolean)=>{
            await axios.put(`http://localhost:8080/api/v0/${workflowId}/activated`,{active: newStatus})
            setWorkflows((prevWorkflows) =>
                prevWorkflows.map((wf) =>
                  wf.id === workflowId ? { ...wf, active: newStatus } : wf
                )
              );
    }

    const createWorkflow=async ()=>{
    }

  return (
<div className="space-y-4">
    {
    workflows.length>0 ? (workflows.map((flow) => (
        <div key={flow.id}>
          <Link href={`/workflow/${flow.id}`}>
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{flow.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated {new Date(flow.updatedAt).toLocaleDateString()} | Created {new Date(flow.created).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`activeToggle`} className="text-sm">
                    {flow.active ? "Active" : "Inactive"}
                  </Label>
                  <Switch
                    id={`activeToggle`}
                    checked={flow.active}
                    onCheckedChange={(newStatus) => handleActiveToggle(flow.id, newStatus)}
                    onClick={(e) => e.stopPropagation()} 
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))) :(
            <Card className="p-8 flex flex-col items-center justify-center text-center border border-border/40 shadow-sm bg-background/60 mt-10">
            <CardTitle className="text-lg font-semibold mb-2">
                No workflow created yet
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                You haven’t made any workflows yet. Click below to create your first one.
            </p>
            <Button onClick={createWorkflow} className="mt-2">
                + Create Workflow
            </Button>
            </Card>      )
    }
      
    </div>
  );
}