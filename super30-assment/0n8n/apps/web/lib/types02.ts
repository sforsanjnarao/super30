import { Node, Edge, NodeProps } from "@xyflow/react";
import { LucideIcon } from "lucide-react";


export type nodeKind = 'trigger' | 'action';

export type metaData = {
    label: string;
    parameters: Record<string, any>; 
    credentialId?: string;

};


export type AppNode = Node<metaData, string> & {
    kind: nodeKind;
};


export type credentialTypes = {
    id: string;
    name: string;
    type?: string;
    data: Record<string, unknown>;
    createdAt?: string; 
};


export type WorkflowResponse = {
  id: string;
  name: string;
  authorId: string;
  webhookId: string | null;
  active: boolean;
  nodes: AppNode[];
  connections: Edge[];
};

export type NodeDefinitions = {
  kind: nodeKind;
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  // Use AppNode here instead of NodeTypes
  customComponent: React.FC<NodeProps<AppNode>>; 
}