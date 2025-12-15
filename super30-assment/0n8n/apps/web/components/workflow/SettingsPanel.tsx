'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TelegramSettings } from "./settings/TelegramSettings";

import axios from "axios";
import { AgentSettings } from "./settings/AgentSettings";
import { IfSettings } from "./settings/IfSettings";
import { AppNode, credentialTypes, metaData } from "@lib/types02";


const settingsMap :Record<string, React.ComponentType<SettingsFormProps>> = {
  telegramNode: TelegramSettings,
  Agent: AgentSettings, 
  If: IfSettings, 
};


interface SettingsPanelProps{
  selectedNodeId?:string | null
  nodes:AppNode[],
  onClose:()=>void,
  onUpdateNodeData:(nodeId:string, newData: Partial<metaData>)=>void
}

export interface SettingsFormProps{
  nodeData:metaData
  onUpdate:(updates: Partial<metaData>) => void;
  credentials:credentialTypes[]
}
export function SettingsPanel({ selectedNodeId, nodes, onClose, onUpdateNodeData }:SettingsPanelProps) {
  
 
  const [credentials, setCredentials] = useState<credentialTypes[]>([]);
 
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
   
  useEffect(() => {
    if (selectedNode) {
      const fetchCredentials = async () => {
        try {
          const response = await axios.get<credentialTypes[]>(
        "http://localhost:8080/api/v0/credentials/",
        {
            withCredentials: true,
        }
        );

        setCredentials(response.data);
        } catch (error:any) {
          toast.error(error);
        }
      };
      fetchCredentials()
    }
  }, [selectedNode]); 

  if (!selectedNode) {
    return null;
  }

  const SettingsComponent = settingsMap[selectedNode.type || ""];

  // This is a placeholder for getting the required credential type for a node
  // A better way is to have a small definition object for each node type
  const getCredentialTypeForNode = (type:string) => {
      if (type === 'telegramNode') return 'telegramApi';
      if (type === 'Agent') return 'openAiApi';
      return null;
  }

  const requiredCredentialType = getCredentialTypeForNode(selectedNode.type);
  const filteredCredentials = credentials.filter(c => c.type === requiredCredentialType);

  return (
    <Sheet open={!!selectedNode} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configure: {selectedNode.data?.label || selectedNode.type}</SheetTitle>
          <SheetDescription>
            Adjust the parameters for this step in your workflow.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          {SettingsComponent ? (
            //TelegramSettings
            <SettingsComponent
              nodeData={selectedNode.data}
              onUpdate={(newData) => onUpdateNodeData(selectedNode.id, newData) }
              credentials={filteredCredentials}
            />
          ) : (
            <p className="text-muted-foreground">This node has no configurable settings.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}