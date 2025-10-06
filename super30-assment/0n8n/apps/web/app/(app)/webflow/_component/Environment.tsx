"use client"
import React, { useState, useCallback, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    type Node,
    type Edge,
    addEdge,
    Connection,
    OnNodesChange,
    OnEdgesChange,
    applyEdgeChanges,
    applyNodeChanges,
    ReactFlowProvider, // Import the provider
    useReactFlow,
    OnConnect,      // Import the hook
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sidebar } from './Sidebar'; // This will contain our combobox
import TelegramNode from './nodes/TelegramNode';
import WebhookNode from './nodes/WebhookNode';

const nodeTypes={
  telegramNode: TelegramNode,
  // gmailNode:GmailNode,
  webhookNode: WebhookNode,
  // manualTriggerNode: ManualTriggerNode

}

const initialNodes:Node[]=[
    
  {
    id: "1",
    type: 'webhookNode',
    position: { x: 50, y: 150 },
    data: {
      action: 'Send Message',
    }
},
  {
      id: "2",
      data: {label:'Telegram bot', botName: 'MyTelegramBot', action: 'Send Message', message: 'Hello from React Flow!' },
      type:"telegramNode",
      position:{x:50,y:50}
  },
  
  
]
const initialEdges: Edge[] = [];


const FlowCanvas = ({workflowId}:{workflowId: string})=> {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow(); 
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [isWorkflowActive, setIsWorkflowActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const onNodeChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgeChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect: OnConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleSave = async () => {
        const data = { nodes, connections: edges,  };
        try {
            await axios.post("/api/v0/workflows", data);
            console.log('Workflow saved successfully');
        } catch (err) {
            console.error('Error saving workflow:', err);
        }
    };
    const handleStatusChange=async (checked:boolean)=>{
      setIsWorkflowActive(checked)
      setLoading(true)
      await axios.put(`api/v0/${workflowId}/activated`)
    }

    // --- Drag and Drop Logic ---
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');

        if (typeof type === 'undefined' || !type) {
            return;
        }

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: Node = {
            id: `dnd-node-${Math.random()}`, // Use a more robust ID generator in production
            type,
            position,
            data: { label: `${type} node` },
        };

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition]);

    return (
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
            <div className="h-full w-full relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodeChange}
                    onEdgesChange={onEdgeChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    panOnScroll
                    colorMode="dark"
                    nodesDraggable={isWorkflowActive}
                    nodesConnectable={isWorkflowActive}
                    elementsSelectable={isWorkflowActive}
                >
                    <Background id="dots" gap={10} size={2} color="#111" />
                    <Controls />
                    <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="workflow-status" className="text-white">
                                {isWorkflowActive ? "Active" : "Inactive"}
                            </Label>
                            <Switch
                                id="workflow-status"
                                checked={isWorkflowActive}
                                onCheckedChange={handleStatusChange}
                            />
                        </div>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </ReactFlow>
            </div>
        </div>
    );
};



const Environment = ({workflowId}:{workflowId: string}) => {
    return (
        <div className="flex h-screen w-screen bg-gray-900 text-white">
            <ReactFlowProvider>
                <Sidebar />
                <FlowCanvas workflowId={workflowId} />
            </ReactFlowProvider>
        </div>
    );
};

export default Environment;






