'use client';

import { NODE_DEFINITIONS } from '@/lib/nodes/definitions';
import { BaseNode } from './BaseNode';
import { AppNode } from '@lib/types02';
import { NodeProps } from '@xyflow/react';

// A Telegram node is an action. It can receive data AND pass data on.
// So, it has both an input (target) and an output (source) handle.
export default function TelegramNode({ data }:NodeProps<AppNode>) {
  const definition = NODE_DEFINITIONS.find(def => def.type === 'telegramNode');
  
  // We can display a summary of the configuration right on the node
  const chatId = data.parameters?.chatId;
  const text = data.parameters?.text;

  return (
    <BaseNode
      title={definition?.name || "Telegram Bot"}
      icon={definition?.icon}
      isSource={true}
      isTarget={true}
    >
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {chatId ? (
                <span><strong>Chat ID:</strong> {chatId}</span>
            ) : (
                <span>Chat ID not set.</span>
            )}
            {text ? (
                <span className="truncate"><strong>Message:</strong> {text}</span>
            ) : (
                <span>Message not set.</span>
            )}
        </div>
    </BaseNode>
  );
}