'use client';

import { NODE_DEFINITIONS } from '@/lib/nodes/definitions';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AppNode } from '@lib/types02';

// The "If" node needs a custom structure because it has multiple outputs.
// It won't use our BaseNode directly.
export default function IfNode({ data }:NodeProps<AppNode>) {
  const definition = NODE_DEFINITIONS.find(def => def.type === 'If');
  // let value1= data.parameters?.value1
  // let value2= data.parameters?.value2
  return (
    <Card className="w-64 border-2">
      {/* The single input handle */}
      <Handle type="target" position={Position.Left} className="!bg-teal-500" />
      
      <CardHeader className="flex flex-row items-center space-x-2 p-4">
        {definition?.icon && <definition.icon className="h-6 w-6" />}
        <CardTitle className="text-base">{definition?.name || "Condition"}</CardTitle>
      </CardHeader>

      {/* The two output handles */}
      <div className="relative p-4 pt-0">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span>TRUE</span>
          {/* This handle needs a unique 'id' to be identified by React Flow */}
          <Handle id="true" type="source" position={Position.Right} className="!bg-green-500 !top-1/3" />
        </div>
        <hr className="my-2"/>
        <div className="flex justify-between items-center text-xs font-semibold">
          <span>FALSE</span>
          <Handle id="false" type="source" position={Position.Right} className="!bg-red-500 !top-2/3" />
        </div>
      </div>
    </Card>
  );
}