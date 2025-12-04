// This file will be the single source of truth for all available nodes.

import TelegramNode from '@/components/workflow/nodes/TelegramNode'; // Placeholder for custom node UI
import WebhookNode from '@/components/workflow/nodes/WebhookNode'; // Placeholder for custom node UI
import { BrainCircuit, GitMerge, MessageCircle, Webhook } from 'lucide-react'; // Example icons
import AgentNode from '@/components/workflow/nodes/AgentNode'; // <-- Add this
import IfNode from '@/components/workflow/nodes/IfNode';  

export const NODE_DEFINITIONS = [
  {
    type: 'webhookNode',
    name: 'Webhook',
    description: 'Triggers the workflow when a webhook is called.',
    icon: Webhook,
    customComponent: WebhookNode, // Make sure this points to your new component
  },
  {
    type: 'Telegram',
    name: 'Telegram',
    description: 'Sends a message from a Telegram Bot.',
    icon: MessageCircle,
    customComponent: TelegramNode, // Make sure this points to your new component
  },
  {
    type: 'If', // <-- CRITICAL: This 'type' MUST match the backend ('If')
    name: 'Condition: If',
    description: 'Branches the workflow based on a condition.',
    icon: GitMerge,
    customComponent: IfNode,
  },
  {
    type: 'Agent', // <-- CRITICAL: This 'type' MUST match the backend ('Agent')
    name: 'AI Agent',
    description: 'Processes data with an AI model.',
    icon: BrainCircuit,
    customComponent: AgentNode,
  },



];


// Create a map of node types to their components for React Flow
export const getNodeTypes = () => {
  const nodeTypes = {};
  NODE_DEFINITIONS.forEach(def => {
    nodeTypes[def.type] = def.customComponent;
  });
  return nodeTypes;
};