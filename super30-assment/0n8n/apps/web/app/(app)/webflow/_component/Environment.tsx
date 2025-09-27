"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState, useCallback }  from 'react'
import  { ReactFlow, Background, Controls,type Node, type Edge, addEdge, Connection, OnNodesChange, OnEdgesChange, OnConnect} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {  applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import TelegramNode from './nodes/TelegramNode'
// import GmailNode from './nodes/GmailNode'
import WebhookNode from './nodes/WebhookNode'
// import ManualTriggerNode from './nodes/ManualTriggerNode'
import { Button } from '@components/ui/button'


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

  const initialEdges: Edge[]=[]
  const handelOnclick=async ()=>{
    const data={
      nodes: initialNodes,
      connection: initialEdges
    }
    await axios.post("api/v0/workflows",data)
    .then(()=>{
      console.log('node and connection get saved in the database')
    }).catch((err)=>{console.error('Error:',err)})
  }



const Environment = () => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges]=useState<Edge[]>(initialEdges)


    const onNodeChange: OnNodesChange=useCallback(
            (changes)=>setNodes((nodeSnapshot)=>applyNodeChanges(changes,nodeSnapshot))
        ,[setNodes])
    const onEdgeChange: OnEdgesChange=useCallback(
            (changes)=>setEdges((edgeSnapshot)=>applyEdgeChanges(changes,edgeSnapshot)),
        [setEdges])


    const onConnect: OnConnect=useCallback(
            (params:Connection)=>setEdges((edgeSnapshot)=>addEdge(params,edgeSnapshot)),
        [])

  return (
    <Card className='w-full h-full flex items-center justify-center'>
      <Button onClick={handelOnclick}>Save</Button>
      <CardContent className="h-[500px] w-[700px] p-2 ">
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
                style={{ color: "#2563eb" }} 
                />
            
            </ReactFlow>
          </div>
      </CardContent>
    </Card>
   
  )
}

export default Environment