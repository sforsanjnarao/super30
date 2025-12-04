'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TelegramSettings } from "./settings/TelegramSettings";

import axios from "axios";
import { AgentSettings } from "./settings/AgentSettings";
import { IfSettings } from "./settings/IfSettings";
// import { AgentSettings } from "./settings/AgentSettings";
// ... import other settings components

// This map links a node's 'type' to the component that can edit it.
const settingsMap = {
  telegramNode: TelegramSettings,
  Agent: AgentSettings, 
  If: IfSettings, 
  // Your backend uses 'Telegram' and 'Agent', so we should align these keys.
  // For now, let's assume the frontend node types are telegramNode, agentNode etc.
};

export function SettingsPanel({ selectedNodeId, nodes, onClose, onUpdateNodeData }) {
     interface Credential {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    }
  const [credentials, setCredentials] = useState<Credential[]>([]);
  
  // Find the full node object from the ID
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
   
  // Fetch all credentials when the panel opens for the first time
  useEffect(() => {
    if (selectedNode) {
      const fetchCredentials = async () => {
        try {
          const response = await axios.get<Credential[]>(
        "http://localhost:8080/api/v0/credentials/",
        {
            withCredentials: true,
        }
        );

        setCredentials(response.data);
        } catch (error:any) {
          toast.error(error.message);
        }
      };
      fetchCredentials()
    }
  }, [selectedNode]); // Re-fetch if the selected node changes (though often not necessary)

  if (!selectedNode) {
    return null;
  }

  const SettingsComponent = settingsMap[selectedNode.type];

  // This is a placeholder for getting the required credential type for a node
  // A better way is to have a small definition object for each node type
  const getCredentialTypeForNode = (type) => {
      if (type === 'telegramNode') return 'telegramApi';
      if (type === 'agentNode') return 'openAiApi';
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
            <SettingsComponent
              nodeData={selectedNode.data}
              onUpdate={ (newData) => onUpdateNodeData(selectedNode.id, newData) }
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