"use client"
import { Card } from '@/components/ui/card'
import React from 'react'
import  { ReactFlow, Background, Controls, MiniMap,type Node, type Edge} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const nodes:Node[]=[
    {
        id: "1",
        data:{
            label: "Node 1"
        },
        position:{x:50,y:50}
    },
    {
        id:"2",
        data:{
            label:"Node 2"
        },
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

const edges: Edge[]=[
    {
        id:"1-2",
        source:"1", 
        target:"2"
    },
    {
        id:"2-3",
        source:"2",
        target:"3",
        animated:true
    }
]

const envroment = () => {
  return (
    <Card className="h-[500px] w-[700px] p-2 ">
      <div className="h-full w-full rounded-md overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          
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