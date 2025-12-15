'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    type Node,
    type Edge,
    addEdge,
    type Connection,
    type OnNodesChange,
    type OnEdgesChange,
    applyEdgeChanges,
    applyNodeChanges,
    useReactFlow,
    type OnConnect,
    NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from 'axios';
import { toast } from 'sonner';
import { SettingsPanel } from './SettingsPanel'; 
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { getNodeTypes, NODE_DEFINITIONS } from '@/lib/nodes/definitions';
import { AppNode, metaData, NodeDefinitions, WorkflowResponse } from '@lib/types02';
// import TelegramNode from '../../app/(app)/workflows/_component/nodes/TelegramNode';
// import WebhookNode from '../../app/(app)/workflows/_component/nodes/WebhookNode';

// Define custom node types
const nodeTypes = getNodeTypes();


// --- The Top Bar Component (Internal to this file) ---
// It receives all necessary props from the main component below.
const EditorTopBar = ({ onSave, onStatusChange, isActive, workflowName }:any) => {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <span className="font-semibold">{workflowName || "Untitled Workflow"}</span>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Run
                </Button>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="workflow-status"
                        checked={isActive}
                        onCheckedChange={onStatusChange}
                    />
                    <Label htmlFor="workflow-status">{isActive ? "Active" : "Inactive"}</Label>
                </div>
                <Button size="sm" onClick={onSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>
        </header>
    );
};


export function WorkflowEditor({ workflowId }: { workflowId: string }) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    const [workflowName, setWorkflowName] = useState("");
    const [nodes, setNodes] = useState<AppNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isWorkflowActive, setIsWorkflowActive] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

 



 
    useEffect(() => {
        const fetchWorkflow = async () => {
            try {
                const response = await axios.get<WorkflowResponse>(`http://localhost:8080/api/v0/workflows/${workflowId}`,
                    { withCredentials: true }
                );
                const { name, nodes, connections, active }= response.data;

                setWorkflowName(name);
                // Your backend connections might not be in React Flow's edge format.
                // It's safer to transform them here.
                const flowEdges = connections.map((c) => ({...c, id: `e-${c.source}-${c.target}`}));
                // const flowNodes = (nodes || []).map((n: any) => ({
                //     ...n,
                //     // Ensure 'data' exists so React Flow doesn't crash
                //     data: n.data || { label: '', parameters: {} }
                // })) as AppNode[];

                setNodes(nodes || []);
                setEdges(flowEdges );
                setIsWorkflowActive(active);
                toast.success("Workflow loaded.");
            } catch (error) {
                toast.error('Error fetching workflow.');
                console.error('Error fetching workflow:', error);
            }
        };
        fetchWorkflow();
    }, [workflowId]);

    // React Flow Handlers
    const onNodesChange:OnNodesChange<AppNode> = useCallback((changes) => setNodes((oldNode) => applyNodeChanges(changes, oldNode) as AppNode[]), [setNodes]);
    const onEdgesChange: OnEdgesChange<Edge> = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    const onConnect: OnConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const clearSelectedNode = () => {
        setSelectedNodeId(null);
    };
        

       
    

    const updateNodeData = useCallback((nodeId: string, newData:Partial<metaData>) => {
        setNodes((nds) => 
            nds.map((node) => {
                if (node.id === nodeId) {
                    // Merge new data deeply to avoid overwriting other properties
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    };
                }
                return node;
            })
        );
    }, [setNodes]);


    // Drag and Drop Handlers
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const definition  = NODE_DEFINITIONS.find(def => def.type === type);
        if (!definition) return;


        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNode: AppNode = {
            id: `dnd-node-${Math.random()}`,
            kind:definition.kind,
            type,
            position,
            data: { 
                label: definition.name, // Use the name from the definition
                // Initialize default parameters if you want
                parameters: {}, 
            }, 
        };
        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);


    // API Call Handlers
    const handleSave = async () => {
        // We only save the core data, not React Flow's internal state
        // const nodesToSave = nodes.map(({ position, ...nodeData }) => nodeData);
        // const edgesToSave = edges.map(({ id, ...edgeData }) => edgeData);

        // const data = { nodes: nodesToSave, connections: edgesToSave };

        const nodesToSave = nodes.map(({ selected, dragging, ...rest }) => rest);
        const connectionsToSave = edges.map(({ selected, ...rest }) => rest);

        const data = { nodes: nodesToSave, connections: connectionsToSave };

        const promise = new Promise((resolve, reject) => {
            axios
                .patch(`http://localhost:8080/api/v0/workflows/${workflowId}`, data,
                    {withCredentials:true}
                )
                .then(resolve)
                .catch(reject);
            });
        toast.promise(promise, {
            loading: 'Saving workflow...',
            success: 'Workflow saved successfully!',
            error: 'Error saving workflow.',
        });
    };
    
    const handleStatusChange = async (isActive: boolean) => {
        setIsWorkflowActive(isActive);
        // const promise = axios.put(`/api/workflows/${workflowId}/activate`, { active: isActive });
        const promise = new Promise((resolve, reject) => {
            axios
                .put(`http://localhost:8080/api/v0/workflows/${workflowId}/activate`, { active: isActive },{withCredentials:true})
                .then(resolve)
                .catch(reject);
            });


        toast.promise(promise, {
            loading: 'Updating status...',
            success: (res:any) => {
                // You can show the webhook URL from the response
                if (res.data.webhookUrl) {
                    return `Workflow activated! URL is ready.`;
                }
                return 'Workflow deactivated.';
            },
            error: 'Error updating status.',
        });
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
             
                <EditorTopBar 
                    onSave={handleSave}
                    onStatusChange={handleStatusChange}
                    isActive={isWorkflowActive}
                    workflowName={workflowName}
                />
                <div className="flex flex-grow overflow-hidden">
                    <Sidebar />
                    <div className="flex-grow h-full" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                            onNodeClick={onNodeClick} 
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                    <SettingsPanel
                        selectedNodeId={selectedNodeId} //state
                        nodes={nodes} //state
                        onClose={clearSelectedNode}
                        onUpdateNodeData={updateNodeData}
                    />
                </div>
             
        </div>
    );
}

   