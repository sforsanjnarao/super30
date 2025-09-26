"use client"
import { Card } from '@/components/ui/card'
import React, { useState, useCallback }  from 'react'
import  { ReactFlow, Background, Controls, MiniMap,type Node, type Edge, addEdge, Connection, OnNodesChange, OnEdgesChange, OnConnect} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {  applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import TextUpdaterNode, { CustomEdge } from './nodes/TextUpdaterNode'

const initialNodes:Node[]=[
    {
        id: "1",
        data:{
            label: "Node 1"
        },
        sourcePosition:"bottom", 
        type:"custom-edge",
        position:{x:50,y:50}
    },
    {
        id:"2",
        data:{
            label:"Node 2"
        },
        targetPosition: 'bottom',

        position:{x:100,y:100}
    },
    {
        id:"3",
        position:{x:200,y:200},
        data:{
            label:"Node 3"
        }
    }
]

const initialEdges: Edge[]=[
    {
        id:"1-2",
        source:"1", 
        target:"2",
        type:"step",
        label:"connect with",
        sourceHandle:'a'
    },
    // {
    //     id:"2-3",
    //     source:"2",
    //     target:"3",
    //     animated:true
    // }
]
const edgeTypes = {
    'custom-edge': CustomEdge,
  };
const nodeTypes={
    textUpdater: TextUpdaterNode
}

const envroment = () => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges]=useState<Edge[]>(initialEdges)


    const onNodeChange: OnNodesChange=useCallback((changes)=>setNodes((nodeSnapshot)=>applyNodeChanges(changes,nodeSnapshot)),[setNodes])
    const onEdgeChange: OnEdgesChange=useCallback((changes)=>setEdges((edgeSnapshot)=>applyEdgeChanges(changes,edgeSnapshot)),[setEdges])


    const onConnect: OnConnect=useCallback((params:Connection)=>setEdges((edgeSnapshot)=>addEdge(params,edgeSnapshot)),[])

  return (
    <Card className="h-[500px] w-[700px] p-2 ">
      <div className="h-full w-full rounded-md overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodeChange}
          onEdgesChange={onEdgeChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          panOnScroll
          edgeTypes={edgeTypes}
          colorMode='dark'
          
        >
          <Background 
            id="dots"
            gap={10}
            size={2}
            color="#111"
            />
          <Controls
            className="!bg-white !border !border-gray-300 !rounded-md shadow-md"
            style={{ color: "#2563eb" }} // Tailwind blue-600
            />
          {/* <MiniMap /> */}
        
        </ReactFlow>
      </div>
    </Card>
  )
}

export default envroment