import React from 'react';
import { Handle, Position } from '@xyflow/react';


interface ManualTriggerType {
    data:undefined
}
const ManualTriggerNode = ({ data }:ManualTriggerType) => {
  const onTrigger = () => {
    console.log('Workflow triggered manually!');
    // Example: axios.post(`/api/workflow/${data.workflowId}/trigger`, { someData: 'hello' });
  };

  return (
    <div className="border border-gray-500 p-4 rounded-lg bg-[#2D2D2D] w-[200px]">
      
      <div className="flex items-center gap-2 mb-2">
        <span>⚡️</span>
        <strong className="text-white">Manual Trigger</strong>
      </div>
      
      <p className="text-xs text-gray-400">
        Click the button to run this workflow.
      </p>

      
      <button
        onClick={onTrigger}
        className="w-full py-2 mt-3 bg-gray-600 rounded text-white text-sm hover:bg-gray-500 transition"
      >
        Trigger Workflow
      </button>

      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
};

export default ManualTriggerNode;