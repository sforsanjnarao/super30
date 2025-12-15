'use client';

import { NODE_DEFINITIONS } from '@/lib/nodes/definitions';
import { BaseNode } from './BaseNode';
import { Badge } from '@/components/ui/badge';
import { AppNode } from '@lib/types02';
import { NodeProps } from '@xyflow/react';
//TODO: webhook url with copy paste
// A Webhook is a trigger node, so it ONLY has an output (source) handle.
export default function WebhookNode({ data }:NodeProps<AppNode>) {
  const definition = NODE_DEFINITIONS.find(def => def.type === 'webhookNode');

  return (
    <BaseNode
      title={definition?.name || "Webhook"}
      icon={definition?.icon}
      isSource={true} // It can be a source of a connection
      isTarget={false} // It cannot be the target of a connection
    >
      <div className="flex flex-col gap-2">
         <p className="text-sm text-muted-foreground">
            This workflow starts when a specific URL is called.
         </p>
         <Badge variant="secondary" className="self-start">Trigger</Badge>
      </div>
    </BaseNode>
  );
}