'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handle, Position } from '@xyflow/react';
import { LucideIcon } from "lucide-react";
import React, { ReactNode } from 'react';

interface BaseNodeProps {
  title: string;
  icon?: LucideIcon; // Allows passing the specific icon component
  children?: ReactNode; // Allows passing nested JSX elements
  isSource?: boolean;
  isTarget?: boolean;
}

// This is a reusable component for the node's visual structure
export function BaseNode({ title, icon: Icon, children, isSource, isTarget }:BaseNodeProps) {
  return (
    <Card className="w-64 border-2">
      {isTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-teal-500"
        />
      )}
      
      <CardHeader className="flex flex-row items-center space-x-2 p-4">
        {Icon && <Icon className="h-6 w-6" />}
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      
      {/* The content of the node will go here */}
      {children && (
        <CardContent className="p-4 pt-0">
          {children}
        </CardContent>
      )}

      {isSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-teal-500"
        />
      )}
    </Card>
  );
}