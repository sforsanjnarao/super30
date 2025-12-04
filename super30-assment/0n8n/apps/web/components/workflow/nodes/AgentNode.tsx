'use client';

import { NODE_DEFINITIONS } from '@/lib/nodes/definitions';
import { BaseNode } from './BaseNode';

// An Agent node receives data and produces new data.
export default function AgentNode({ data }) {
  const definition = NODE_DEFINITIONS.find(def => def.type === 'Agent');
  const prompt = data.parameters?.prompt;

  return (
    <BaseNode
      title={definition?.name || "AI Agent"}
      icon={definition?.icon}
      isSource={true}
      isTarget={true}
    >
      <div className="text-sm text-muted-foreground truncate">
        {prompt ? `Prompt: ${prompt}` : "Prompt not set."}
      </div>
    </BaseNode>
  );
}