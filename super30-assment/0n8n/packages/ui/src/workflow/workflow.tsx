import { ReactFlow, Background, Controls, type Node, type Edge, useNodesState, useEdgesState, type Connection, addEdge } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';


const intitalNodes: Node[]=[
    {
        id: "1",
        type:'input',
        data:{label:'Input Node'},
        position:{x:0,y:0}
        
    },
    {
        id:'2',
        data:{label:'Input Node 2'},
        position:{x:200,y:200}
        
    },
    {
      id:'3',
      data:{label:'Input Node 3'},
      position:{x:300,y:300}
      
  }
]
const initialEdge: Edge[]=[
    {
        id:'1-2',
        source:'1',
        target:'2',
        animated:true,
        style:{stroke:'#fff'}
    }
]
function Workflow() {
  const [nodes,setNodes, onNodesChange]=useNodesState(intitalNodes)
  const [edges,setEdges, onEdgesChange]=useEdgesState(initialEdge)
  const onConnect=useCallback((connection: Connection)=>{
    const edge={...connection, animated:true, id:`${edges.length}+1`, style:{stroke:'#fff'}}
    setEdges((prevEdges )=>addEdge(edge, prevEdges))
  },[])
    return ( 
      <div className="flex items-center justify-center h-screen w-screen
                      bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-900
                      dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="h-[600px] w-[800px] bg-transparent shadow-2xl rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange} //helper function to handle node and edges changes
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            colorMode="dark"
            className="bg-transparent"
          >
            <Background gap={10} size={1} color="#444" />
            <Controls />

          </ReactFlow>
        </div>
      </div>
    );
  }
export default Workflow