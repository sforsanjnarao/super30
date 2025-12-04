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


// Import UI components
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play } from 'lucide-react';
import { Sidebar } from './Sidebar'; // Your existing sidebar
import { getNodeTypes, NODE_DEFINITIONS } from '@/lib/nodes/definitions';
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


// --- The Main Editor Component ---
// This is your 'Environment' and 'FlowCanvas' logic combined and cleaned up.
export function WorkflowEditor({ workflowId }: { workflowId: string }) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    // State Management
    const [workflowName, setWorkflowName] = useState("Loading...");
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isWorkflowActive, setIsWorkflowActive] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);


    // interface workflowdata{
    //     name:string,
    //     nodes: NodeData[],
    //     connections: ConnectionData[],
    //     active: boolean
    // }
    // interface ConnectionType {
    //     source: string;
    //     target: string;
    //     [key: string]: any;
    //     }

    // interface NodeData {
    //     id: string;
    //     type: string;
    //     parameters?: Record<string, any>;
    //     credentialsId?: string;
    //     position?: { x: number; y: number };
    // }

    // interface ConnectionData {
    //     id: string;
    //     source: string;
    //     target: string;
    // }

    // For position of each node
type Position = {
  x: number;
  y: number;
};

// For the data field inside each node
type NodeData = {
  label: string;
  parameters: Record<string, any>; // flexible key-value params
};

// For each node in the workflow
 type WorkflowNodes = {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
  measured?: {
    width: number;
    height: number;
  };
};

// For connections between nodes (edges)
 type ConnectionType = {
  source: string;
  target: string;
  id: string;
};

// Full workflow type from backend
 type WorkflowResponse = {
  id: string;
  name: string;
  authorId: string;
  webhookId: string | null;
  active: boolean;
  nodes: WorkflowNodes[];
  connections: ConnectionType[];
  createdAt: string;
  updatedAt: string;
};
    // Fetch initial workflow data
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
                const flowEdges = connections.map((c:ConnectionType) => ({...c, id: `e-${c.source}-${c.target}`}));

                setNodes(nodes || []);
                setEdges(flowEdges || []);
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
    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    const onConnect: OnConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const clearSelectedNode = () => {
        setSelectedNodeId(null);
    };
         interface WorkflowNodeData {
        parameters: Record<string, any>;  // e.g. { prompt: "capital of india?" }
        credentialsId?: string;
        }

        interface WorkflowNode {
        id: string;
        type: string; // e.g. "Agent" | "Telegram"
        position: {
            x: number;
            y: number;
        };
        data: WorkflowNodeData;
    }
    

    const updateNodeData = useCallback((nodeId: string, newData:Partial<WorkflowNodeData>) => {
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

        const definition = NODE_DEFINITIONS.find(def => def.type === type);
        if (!definition) return;


        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
       const newNode: Node = {
            id: `dnd-node-${Math.random()}`,
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
                        selectedNodeId={selectedNodeId}
                        nodes={nodes}
                        onClose={clearSelectedNode}
                        onUpdateNodeData={updateNodeData}
                    />
                </div>
             
        </div>
    );
}

   