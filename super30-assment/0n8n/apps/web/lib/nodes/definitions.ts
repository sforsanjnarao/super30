// This file will be the single source of truth for all available nodes.

import TelegramNode from '@/components/workflow/nodes/TelegramNode'; 
import WebhookNode from '@/components/workflow/nodes/WebhookNode';
import { BrainCircuit, GitMerge, MessageCircle, Webhook } from 'lucide-react';
import AgentNode from '@/components/workflow/nodes/AgentNode';
import IfNode from '@/components/workflow/nodes/IfNode';  
import { NodeDefinitions } from '@lib/types02';

export const NODE_DEFINITIONS: NodeDefinitions[] = [
  {
    type: 'webhookNode',
    kind:'trigger',
    name: 'Webhook',
    description: 'Triggers the workflow when a webhook is called.',
    icon: Webhook,
    customComponent: WebhookNode, 
  },
  {
    kind:'action',
    type: 'telegramNode',
    name: 'Telegram',
    description: 'Sends a message from a Telegram Bot.',
    icon: MessageCircle,
    customComponent: TelegramNode, 
  },
  {
    kind:'action',
    type: 'If', // <-- CRITICAL: This 'type' MUST match the backend ('If')
    name: 'Condition: If',
    description: 'Branches the workflow based on a condition.',
    icon: GitMerge,
    customComponent: IfNode, // Make sure this points to your new component
  },
  {
    kind:'action',
    type: 'Agent',
    name: 'AI Agent',
    description: 'Processes data with an AI model.',
    icon: BrainCircuit,
    customComponent: AgentNode,
  },



];



// Create a map of node types to their components for React Flow
export const getNodeTypes = () => {
  const nodeTypes:Record<string, React.ComponentType<any>> = {};
  NODE_DEFINITIONS.forEach(def => {
    nodeTypes[def.type] = def.customComponent;
  });
  return nodeTypes;
};