import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css';

function Workflow() {
    return (
      <div className="flex items-center justify-center h-screen w-screen
                      bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-900
                      dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="h-[600px] w-[800px] bg-transparent shadow-2xl rounded-lg overflow-hidden">
          <ReactFlow
            fitView
            colorMode="dark"
            className="bg-transparent"
          >
            <Background gap={16} size={1} color="#444" />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    );
  }
export default Workflow