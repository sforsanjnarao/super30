"use client";

import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import api from "@/lib/api";

const hardcodedWorkflowId = "YOUR_WORKFLOW_ID"; // Replace with one from DB

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Save workflow
  const saveWorkflow = async () => {
    try {
      const res = await api.post("/workflows", {
        name: "test-workflow-" + Date.now(),
        nodes,
        connections: edges,
      });
      alert("Workflow saved: " + res.data.createWebFlow.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Load workflow
  const loadWorkflow = async () => {
    try {
      const res = await api.get(`/workflows/${hardcodedWorkflowId}`);
      const wf = res.data.allWorkFlows;
      setNodes(wf.nodes);
      setEdges(wf.connections);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadWorkflow();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button
        onClick={saveWorkflow}
        className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
