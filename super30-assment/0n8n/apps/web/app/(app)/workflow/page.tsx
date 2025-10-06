"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


interface workflowTypes{
    id: string,
    name: string,
    updatedAt: string;
    created: string,
    isActive: boolean
}

interface WorkflowResponse{
    workflows:workflowTypes[]
}


export default function WorkflowsPage() {
  const [workflows, setWorkflows]=useState<workflowTypes[]>([])

    useEffect(()=>{
        const dataFetch=async ()=>{
            const res = await axios.get<WorkflowResponse>('api/v0/workflows')
            setWorkflows(res.data.workflows)  //may be workflows
        }
        dataFetch()
    },[])

    const handleActiveToggle= async(workflowId: string, newStatus: boolean)=>{
            await axios.put(`api/v0/${workflowId}/activated`,{active: newStatus})
            setWorkflows((prevWorkflows) =>
                prevWorkflows.map((wf) =>
                  wf.id === workflowId ? { ...wf, active: newStatus } : wf
                )
              );
    }

  return (
    <div className="space-y-4">

      {workflows.map((flow) => (
        <div key={flow.id} >
            <Link href={`/workflow/${flow.id}`} >
                <Card >
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                    <h3 className="font-semibold">{flow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        Last updated {new Date(flow.updatedAt).toLocaleDateString()} | Created {new Date(flow.created).toLocaleDateString()}
                    </p>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Label htmlFor={`activeToggle`} className="text-sm">
                        {flow.isActive ? "Active" : "Inactive"}
                    </Label>
                    <Switch
                        id={`activeToggle`}
                        checked={flow.isActive}
                        onCheckedChange={(statusChange)=>handleActiveToggle(flow.id,statusChange)}
                        onClick={(e)=>e.stopPropagation}
                    />
                    </div>
                </CardContent>
                </Card>
            </Link>
        </div>
      ))}
    </div>
  );
}